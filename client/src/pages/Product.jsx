import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categoryLabel, formatPrice, getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Stars from '../components/Stars';
import Accordion from '../components/Accordion';
import Tooltip from '../components/Tooltip';
import NotFound from './NotFound';

const REVIEWS = [
  { title: 'Excellent flagship', rating: 5, author: 'John D.', date: '2026-05-12', text: 'Incredibly fast and the build feels premium. Battery easily lasts a full day.' },
  { title: 'Great, but pricey', rating: 4, author: 'Maria S.', date: '2026-04-28', text: 'Quality is stunning. Only downside is the high price compared to last year.' },
  { title: 'Best I have owned', rating: 5, author: 'Andrii K.', date: '2026-04-03', text: 'The display is gorgeous outdoors and performance is flawless.' },
];

export default function Product() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addItem } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);

  if (!product) return <NotFound />;

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${qty}× ${product.title} added to cart`, { title: 'Added to cart' });
  };

  const specItems = [
    {
      title: 'Technical specifications',
      content: (
        <table>
          <caption>Technical specifications of {product.title}</caption>
          <tbody>
            {Object.entries(product.specs).map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: 'Shipping & returns',
      content: <p>Free shipping on orders over $99. 30-day no-questions returns and a 2-year official warranty on all devices.</p>,
    },
    {
      title: 'In the box',
      content: <p>{product.title}, USB-C cable, quick-start guide and warranty card.</p>,
    },
  ];

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/catalog">Catalog</Link></li>
          <li><Link to={`/catalog?category=${product.category}`}>{categoryLabel(product.category)}</Link></li>
          <li>{product.title}</li>
        </ul>
      </nav>

      <article className="product-detail">
        <h2>{product.title}</h2>

        <section className="gallery" aria-labelledby="gallery-heading">
          <h3 id="gallery-heading">Gallery</h3>
          <img src={product.image} alt={`${product.title} main view`} />
          <img src={product.image} alt={`${product.title} angle view`} />
          <img src={product.image} alt={`${product.title} rear view`} />
          <img src={product.image} alt={`${product.title} detail view`} />
        </section>

        <section className="purchase" aria-labelledby="buy-heading">
          <h3 id="buy-heading">Purchase</h3>
          <p className="price">
            Price: <strong>{formatPrice(product.price)}</strong>
          </p>
          <p>
            Availability:{' '}
            <strong>{product.inStock ? `In stock (${product.units} units)` : 'Out of stock'}</strong>
          </p>
          <Stars value={product.rating} />

          <div style={{ marginTop: 'var(--space-4)' }}>
            <label style={{ marginBottom: 'var(--space-2)' }}>Quantity</label>
            <div className="qty-stepper" role="group" aria-label="Quantity selector">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <input
                type="number"
                min="1"
                max="10"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                aria-label="Quantity"
              />
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
              {product.inStock ? (
                <button type="button" className="btn-block" onClick={handleAdd}>Add to cart</button>
              ) : (
                <Tooltip text="This item is out of stock and cannot be ordered right now.">
                  <button type="button" className="btn-block" disabled>Add to cart</button>
                </Tooltip>
              )}
            </div>
          </div>
        </section>

        <section className="specs" aria-labelledby="specs-heading">
          <h3 id="specs-heading">Details</h3>
          <Accordion items={specItems} />
        </section>

        <section className="description" aria-labelledby="desc-heading">
          <h3 id="desc-heading">Description</h3>
          <p>{product.shortDesc} {product.title} combines premium build quality with leading performance, making it a standout choice in the {categoryLabel(product.category).toLowerCase()} category from {product.brand}.</p>
        </section>

        <section className="reviews" aria-labelledby="reviews-heading">
          <h3 id="reviews-heading">Customer reviews</h3>
          {REVIEWS.map((rv) => (
            <article key={rv.title}>
              <h4>{rv.title}</h4>
              <p>Rating: {rv.rating} / 5</p>
              <p>By {rv.author} on {rv.date}</p>
              <p>{rv.text}</p>
            </article>
          ))}
        </section>
      </article>
    </>
  );
}
