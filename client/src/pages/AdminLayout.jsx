import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Admin layout placeholder. Full administrative functionality (CRUD for
// products, orders, users, reviews) is implemented in Lab work #5; here we
// only provide the shell so the route exists and the design carries over.
// Rendered outside the store Layout so it can use the dark admin header.
export default function AdminLayout() {
  useEffect(() => {
    document.body.className = 'admin';
    return () => { document.body.className = 'page-home'; };
  }, []);

  return (
    <>
      <header className="admin-header">
        <div className="container header-inner">
          <div className="brand-block">
            <Link className="brand" to="/admin"><h1>TechShop</h1></Link>
            <p className="tagline">Administration panel</p>
          </div>
          <nav className="main-nav" aria-label="Admin top navigation">
            <ul><li><Link to="/">View store</Link></li></ul>
          </nav>
        </div>
      </header>

      <div className="container admin-shell">
        <aside className="admin-sidebar">
          <nav className="admin-nav" aria-label="Admin navigation">
            <ul>
              <li><Link to="/admin">Dashboard</Link></li>
              <li><Link to="/admin">Products</Link></li>
              <li><Link to="/admin">Orders</Link></li>
              <li><Link to="/admin">Users</Link></li>
              <li><Link to="/admin">Reviews</Link></li>
            </ul>
          </nav>
        </aside>

        <main>
          <h2>Admin dashboard</h2>
          <section className="stats">
            <h3>Overview</h3>
            <article><h4>Total products</h4><p>18</p></article>
            <article><h4>Orders today</h4><p>7</p></article>
            <article><h4>Revenue (mo.)</h4><p>$24,380</p></article>
            <article><h4>Pending reviews</h4><p>3</p></article>
          </section>
          <section>
            <div className="admin-placeholder">
              <h3>Coming in Lab work #5</h3>
              <p>Full product / order / user management with live tables and status badges.</p>
            </div>
          </section>
        </main>
      </div>

      <footer className="admin-footer">
        <div className="container footer-grid">
          <p>&copy; 2026 TechShop — Admin</p>
          <nav className="footer-nav"><ul><li><Link to="/">Back to store</Link></li></ul></nav>
        </div>
      </footer>
    </>
  );
}
