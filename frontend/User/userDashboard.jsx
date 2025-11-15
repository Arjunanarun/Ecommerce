import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// Import 'react-icons'
import {
  FiUser,
  FiShoppingCart,
  FiLogOut,
  FiLoader,
  FiAlertCircle,
  FiX,
  FiEye,
} from 'react-icons/fi';
// Import the CSS file
import './UserDashboard.css';
// Import your AuthContext
import { AuthContext } from '../Context/AuthContext'; // Assuming context is at src/Context

// Use the VITE_API_URL, fallback to your port 5000 from server.js
const BaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper function to safely join URLs
const cleanUrl = (path) => {
  return `${BaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

// --- Reusable Components ---

/**
 * Loading Spinner Component
 */
const LoadingSpinner = () => (
  <div className="loading-container">
    <FiLoader className="loading-spinner" />
    <p>Loading data...</p>
  </div>
);

/**
 * Error Message Component
 */
const ErrorDisplay = ({ message }) => (
  <div className="error-container">
    <FiAlertCircle className="error-icon" />
    <p>Error: {message}</p>
  </div>
);

/**
 * Sidebar Navigation
 */
const Sidebar = ({ view, setView, onLogout }) => {
  const navItems = [
    { name: 'My Profile', icon: <FiUser />, view: 'profile' },
    { name: 'My Orders', icon: <FiShoppingCart />, view: 'orders' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">My Account</span>
      </div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setView(item.view)}
                className={`sidebar-nav-item ${
                  view === item.view ? 'active' : ''
                }`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* --- Logout Button --- */}
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          <FiLogOut style={{ marginRight: '8px' }} />
          Log Out
        </button>
      </div>
    </div>
  );
};

// --- Page View Components ---

/**
 * Profile View
 */
const ProfileView = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    mobilenum: user.mobilenum || '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match');
      return;
    }

    try {
      // Create payload, only include password if it's being changed
      const payload = {
        username: formData.username,
        email: formData.email,
        mobilenum: formData.mobilenum,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      // Call the API to update the profile
      const { data } = await axios.put(cleanUrl('/api/users/profile'), payload, {
        withCredentials: true,
      });

      // Update the AuthContext with the new user data
      onProfileUpdate(data);
      setIsError(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setIsError(true);
      const errorMsg =
        err.response?.data?.message || 'Failed to update profile';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="page-view">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="page-title">My Profile</h2>
        </div>
        <div className="profile-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username (optional)</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Jane Doe"
              />
            </div>
            <div className="form-group">
              <label>Email (Cannot be changed if used for login)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
                disabled={!user.googleId} // Disable if email/pass user
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="mobilenum"
                value={formData.mobilenum}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
            <p style={{ color: '#666', fontSize: '14px' }}>
              Only fill in the fields below if you want to change your password.
            </p>
            <div className="form-group">
              <label>New Password (min. 6 characters)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Confirm new password"
              />
            </div>

            <div className="form-actions">
              {message && (
                <p
                  style={{
                    color: isError ? '#dc3545' : '#28a745',
                    marginRight: 'auto',
                  }}
                >
                  {message}
                </p>
              )}
              <button type="submit" className="button button-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Order Details Modal
 */
const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Order Details ({order._id})</h2>
          <button onClick={onClose} className="modal-close-button">
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <div className="order-details-grid">
            <div className="order-details-section">
              <h3>Shipping</h3>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address}
              </p>
              <p>
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div className="order-details-section">
              <h3>Payment & Status</h3>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Paid:</strong>{' '}
                {order.isPaid ? (
                  <span className="status-badge status-paid">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="status-badge status-not-paid">Not Paid</span>
                )}
              </p>
              <p>
                <strong>Delivered:</strong>{' '}
                {order.isDelivered ? (
                  <span className="status-badge status-delivered">
                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="status-badge status-processing">
                    Not Delivered
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="order-details-section" style={{ marginTop: '20px' }}>
            <h3>Order Items</h3>
            <div className="order-item-list">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://placehold.co/50x50/eee/aaa?text=Img';
                    }}
                  />
                  <div className="order-item-info">
                    <strong>{item.name}</strong>
                    <br />
                    {item.qty} x ${item.price.toFixed(2)} = $
                    {(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Orders Management View
 */
const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // This route must exist on your backend
        const { data } = await axios.get(cleanUrl('/api/orders/myorders'), {
          withCredentials: true,
        });
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="page-view">
      <h2 className="page-title">My Orders</h2>
      <div className="table-container">
        {orders.length === 0 ? (
          <p style={{ padding: '20px' }}>You have not placed any orders yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <span className="status-badge status-paid">Paid</span>
                    ) : (
                      <span className="status-badge status-not-paid">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className="status-badge status-delivered">
                        Delivered
                      </span>
                    ) : (
                      <span className="status-badge status-processing">
                        Processing
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="button button-secondary"
                      style={{ padding: '5px 10px', fontSize: '13px' }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FiEye style={{ marginRight: '5px' }} />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

// --- Main App Component ---

const UserDashboard = () => {
  const [view, setView] = useState('profile'); // 'profile', 'orders'

  const { user, loading, logout, login } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    // Redirect to home or login page after logout
    window.location.href = '/login';
  };

  const handleProfileUpdate = (authData) => {
    // This function comes from the ProfileView
    // It updates the AuthContext, so the new username/email shows up
    login(authData);
  };

  // Wait for context to finish loading user
  if (loading) {
    return (
      <div className="user-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  // If loading is done and still no user, redirect to login
  if (!user) {
    window.location.href = '/login';
    return <LoadingSpinner />; // Show spinner while redirecting
  }

  // If user is an admin, maybe redirect to admin dashboard?
  if (user.isAdmin) {
    // Optional: redirect admins away from the user dashboard
    // window.location.href = '/admin-dashboard';
    // return <LoadingSpinner />;
  }

  const renderView = () => {
    switch (view) {
      case 'profile':
        return (
          <ProfileView user={user} onProfileUpdate={handleProfileUpdate} />
        );
      case 'orders':
        return <OrdersView />;
      default:
        return (
          <ProfileView user={user} onProfileUpdate={handleProfileUpdate} />
        );
    }
  };

  return (
    <div className="user-layout">
      <Sidebar view={view} setView={setView} onLogout={handleLogout} />
      <div className="main-content">{renderView()}</div>
    </div>
  );
};

export default UserDashboard;