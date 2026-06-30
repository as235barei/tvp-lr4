import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Protected account page. Access is guarded by <ProtectedRoute> (Lab #4): guests
// are redirected to /login before this component renders. Shows the real,
// JWT-verified user returned by GET /api/auth/me.
const ORDERS = [
  { id: '#10428', date: '2026-06-10', items: 'iPhone 15 Pro, AirPods Pro 2', total: '$1348.00', status: 'delivered' },
  { id: '#10319', date: '2026-04-22', items: 'MacBook Air M3', total: '$1199.00', status: 'delivered' },
  { id: '#10277', date: '2026-03-15', items: 'Sony WH-1000XM5', total: '$399.00', status: 'shipped' },
  { id: '#10198', date: '2026-02-02', items: 'Apple Watch Series 9, Anker Charger', total: '$478.00', status: 'cancelled' },
];

export default function Account() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const onLogout = async () => {
    await logout();
    toast.info('You have been logged out');
    navigate('/');
  };

  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—';

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>My Account</li>
        </ul>
      </nav>

      <h2>My account</h2>

      <section aria-labelledby="profile-heading">
        <h3 id="profile-heading">Profile</h3>
        <table>
          <caption>Account details</caption>
          <tbody>
            <tr><th scope="row">Full name</th><td>{user.name}</td></tr>
            <tr><th scope="row">Email</th><td>{user.email}</td></tr>
            <tr><th scope="row">Role</th><td>{user.role}</td></tr>
            <tr><th scope="row">Member since</th><td>{memberSince}</td></tr>
          </tbody>
        </table>
        <p>
          <button type="button" className="btn-danger" onClick={onLogout}>Log out</button>
        </p>
      </section>

      <section aria-labelledby="orders-heading">
        <h3 id="orders-heading">Order history</h3>
        <table>
          <caption>Your previous orders</caption>
          <thead>
            <tr>
              <th scope="col">Order #</th>
              <th scope="col">Date</th>
              <th scope="col">Items</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.date}</td>
                <td>{o.items}</td>
                <td>{o.total}</td>
                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
