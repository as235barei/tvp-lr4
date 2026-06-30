import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BRANDS, CATEGORIES, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { InfoTip } from '../components/Tooltip';

const PRICE_MAX = 2000;

const SORTS = {
  popular: { label: 'Popularity', fn: (a, b) => b.rating - a.rating },
  price_asc: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  price_desc: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Customer rating', fn: (a, b) => b.rating - a.rating },
  name: { label: 'Name (A–Z)', fn: (a, b) => a.title.localeCompare(b.title) },
};

// Catalogue with fully dynamic, instant filtering & sorting (no page reload).
// Every control writes to React state; the visible list is recomputed with
// useMemo. URL params (?category=, ?q=) seed the initial filters so the
// header search and category chips deep-link here.
export default function Catalog() {
  const [params] = useSearchParams();

  const [selectedCats, setSelectedCats] = useState(
    () => new Set(params.get('category') ? [params.get('category')] : []),
  );
  const [selectedBrands, setSelectedBrands] = useState(() => new Set());
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('popular');
  const [quickView, setQuickView] = useState(null);

  // keep state in sync if user navigates with a different deep link
  useEffect(() => {
    const cat = params.get('category');
    setSelectedCats(cat ? new Set([cat]) : new Set());
    setQuery(params.get('q') ?? '');
  }, [params]);

  const toggleSet = (setter) => (value) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  const toggleCat = toggleSet(setSelectedCats);
  const toggleBrand = toggleSet(setSelectedBrands);

  // --- the instant filtering + sorting pipeline ---------------------------
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (selectedCats.size && !selectedCats.has(p.category)) return false;
      if (selectedBrands.size && !selectedBrands.has(p.brand)) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      if (q && !(`${p.title} ${p.brand} ${p.shortDesc}`.toLowerCase().includes(q))) return false;
      return true;
    });
    return [...list].sort(SORTS[sort].fn);
  }, [selectedCats, selectedBrands, maxPrice, inStockOnly, query, sort]);

  const resetAll = () => {
    setSelectedCats(new Set());
    setSelectedBrands(new Set());
    setQuery('');
    setMaxPrice(PRICE_MAX);
    setInStockOnly(false);
    setSort('popular');
  };

  const hasActiveFilters =
    selectedCats.size || selectedBrands.size || query.trim() || maxPrice < PRICE_MAX || inStockOnly;

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>Catalog</li>
        </ul>
      </nav>

      <h2>Product catalog</h2>

      <aside className="filters" aria-labelledby="filters-heading">
        <h3 id="filters-heading">Filters</h3>

        <fieldset>
          <legend>Search</legend>
          <input
            type="search"
            placeholder="Search by name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products by name"
          />
        </fieldset>

        <fieldset>
          <legend>Category</legend>
          <div className="filter-chips">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`chip${selectedCats.has(c.id) ? ' selected' : ''}`}
                aria-pressed={selectedCats.has(c.id)}
                onClick={() => toggleCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            Max price{' '}
            <InfoTip text="Drag the slider to set the highest price you want to see. Results update instantly." />
          </legend>
          <div className="range-row">
            <span>$0</span>
            <strong style={{ marginLeft: 'auto' }}>${maxPrice}</strong>
          </div>
          <input
            type="range"
            className="range-slider"
            min="0"
            max={PRICE_MAX}
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-label="Maximum price"
          />
        </fieldset>

        <fieldset>
          <legend>Brand</legend>
          {BRANDS.map((b) => (
            <label key={b}>
              <input
                type="checkbox"
                checked={selectedBrands.has(b)}
                onChange={() => toggleBrand(b)}
              />{' '}
              {b}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Availability</legend>
          <label>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />{' '}
            In stock only
          </label>
        </fieldset>

        <button type="button" className="btn-secondary" onClick={resetAll}>
          Reset filters
        </button>
      </aside>

      <section className="results" aria-labelledby="results-heading" aria-live="polite">
        <h3 id="results-heading" className="sr-only">Results</h3>

        <div className="results-bar">
          <span className="results-count">
            <strong>{visible.length}</strong> {visible.length === 1 ? 'product' : 'products'} found
            {selectedCats.size === 1 && ` in ${CATEGORIES.find((c) => selectedCats.has(c.id))?.label}`}
          </span>
          <div className="sort-inline">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="active-filters">
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Active:</span>
            {query.trim() && (
              <button className="chip selected" onClick={() => setQuery('')}>
                “{query.trim()}” ×
              </button>
            )}
            {[...selectedCats].map((c) => (
              <button key={c} className="chip selected" onClick={() => toggleCat(c)}>
                {CATEGORIES.find((x) => x.id === c)?.label} ×
              </button>
            ))}
            {[...selectedBrands].map((b) => (
              <button key={b} className="chip selected" onClick={() => toggleBrand(b)}>
                {b} ×
              </button>
            ))}
            {maxPrice < PRICE_MAX && (
              <button className="chip selected" onClick={() => setMaxPrice(PRICE_MAX)}>
                ≤ ${maxPrice} ×
              </button>
            )}
            {inStockOnly && (
              <button className="chip selected" onClick={() => setInStockOnly(false)}>
                In stock ×
              </button>
            )}
          </div>
        ) : null}

        <div className="product-grid">
          {visible.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try widening your price range or clearing some filters.</p>
              <button type="button" style={{ marginTop: 'var(--space-3)' }} onClick={resetAll}>
                Clear all filters
              </button>
            </div>
          ) : (
            visible.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuickView} />)
          )}
        </div>
      </section>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
