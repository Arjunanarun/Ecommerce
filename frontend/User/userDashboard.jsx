import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  FiUser,
  FiShoppingCart,
  FiLogOut,
  FiLoader,
  FiAlertCircle,
  FiX,
  FiEye,
  FiMenu,
  FiEdit2, // Added for the avatar edit badge
} from 'react-icons/fi';
import './UserDashboard.css';
import { AuthContext } from '../Context/AuthContext';

// --- CONFIGURATION ---
const BaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const cleanUrl = (path) => {
  return `${BaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};
const PLACEHOLDER_AVATAR = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=100&h=100&q=80";

// --- REUSABLE HELPER COMPONENTS (Hoisted) ---

const LoadingSpinner = () => (
  <div className="loading-container">
    <FiLoader className="loading-spinner" />
    <p>Loading data...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="error-container">
    <FiAlertCircle className="error-icon" />
    <p>Error: {message}</p>
  </div>
);

const Sidebar = ({ view, setView, onLogout, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  // Modified navItems to match the requested design (removed payment, added address/password)
  const navItems = [
    { name: 'Personal Information', view: 'profile' },
    { name: 'My Orders', view: 'orders' },
    { name: 'Manage Address', view: 'address' },
    { name: 'Password Manager', view: 'password' },
    { name: 'Logout', view: 'logout' },
  ];

  const handleNavClick = (newView) => {
    if (newView === 'logout') {
      onLogout();
      return;
    }
    setView(newView);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
      {isMobileMenuOpen && (
        <button className="sidebar-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <FiX size={24} />
        </button>
      )}
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleNavClick(item.view)}
                className={`sidebar-nav-item ${view === item.view ? 'active' : ''
                  } ${item.view === 'logout' ? 'logout-item' : ''}`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// ----------------------------------------------------
// --- PAGE VIEW COMPONENTS (Hoisted) ---
// ----------------------------------------------------

/**
 * Profile View (Personal Information - Matches Image Design)
 */
const ProfileView = ({ user, onProfileUpdate }) => {
  // Initialization without hardcoded defaults
  const [formData, setFormData] = useState({
    username: user?.username || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.mobilenum || '',
    gender: user?.gender || '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving changes...');
    setIsError(false);

    try {
      const payload = {
        username: formData.username,
        lastname: formData.lastname,
        email: formData.email,
        mobilenum: formData.phone,
        gender: formData.gender,
      };

      // 🛑 API CALL Placeholder: Replace with actual axios call
      // const { data } = await axios.put(cleanUrl('/api/users/profile'), payload, { withCredentials: true });
      // onProfileUpdate(data);

      setIsError(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setIsError(true);
      const errorMsg = 'Failed to update profile';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="page-view profile-page">
      <div className="profile-edit-card">

        {/* Avatar Display */}
        <div className="profile-header-area">
          <img
            src={user?.avatar || PLACEHOLDER_AVATAR}
            alt="User Avatar"
            className="profile-avatar"
          />
          <span className="avatar-edit-badge"><FiEdit2 size={14} /></span>
        </div>

        <form onSubmit={handleSubmit} className="profile-form-grid">

          {/* Field 1: First Name */}
          <div className="form-group">
            <label htmlFor="firstName" className="form-label required">First Name</label>
            <input
              type="text" id="firstName" name="username"
              value={formData.username} onChange={handleInputChange}
              className="form-input" required
            />
          </div>

          {/* Field 2: Last Name */}
          <div className="form-group">
            <label htmlFor="lastName" className="form-label required">Last Name</label>
            <input
              type="text" id="lastName" name="lastname"
              value={formData.lastname} onChange={handleInputChange}
              className="form-input" required
            />
          </div>

          {/* Field 3: Email (Full Width) */}
          <div className="form-group full-width">
            <label htmlFor="email" className="form-label required">Email</label>
            <input
              type="email" id="email" name="email"
              value={formData.email} onChange={handleInputChange}
              className="form-input" required
            />
          </div>

          {/* Field 4: Phone (Full Width) */}
          <div className="form-group full-width">
            <label htmlFor="phone" className="form-label required">Phone</label>
            <input
              type="tel" id="phone" name="phone"
              value={formData.phone} onChange={handleInputChange}
              className="form-input" required
            />
          </div>

          {/* Field 5: Gender (Full Width) */}
          <div className="form-group full-width">
            <label htmlFor="gender" className="form-label required">Gender</label>
            <select
              id="gender" name="gender"
              value={formData.gender} onChange={handleInputChange}
              className="form-input form-select" required
            >
              <option value="" disabled hidden>Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Field 6: Update Button (Full Width) */}
          <div className="form-group full-width form-actions">
            {message && (
              <p style={{ color: isError ? '#dc3545' : '#4CAF50', marginRight: '20px' }}>
                {message}
              </p>
            )}
            <button type="submit" className="update-button">
              Update Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Placeholder components for other views ---
const MyOrdersView = () => (<div className="content-placeholder-card"><h3>My Orders</h3><p>You haven't placed any orders yet.</p></div>);
const ManageAddressView = () => (<div className="content-placeholder-card"><h3>Manage Address</h3><p>No addresses saved. Add a new address to continue.</p></div>);
const PasswordManagerView = () => (<div className="content-placeholder-card"><h3>Password Manager</h3><p>Manage your password here.</p></div>);
// --- (OrderDetailsModal and OrdersView components from your previous code would be placed here) ---


// --- MAIN APP COMPONENT ---

const UserDashboard = () => {
  const [view, setView] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, loading, logout, login } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleProfileUpdate = (authData) => {
    login(authData);
  };

  if (loading) {
    return (<div className="user-layout loading-screen"><LoadingSpinner /></div>);
  }

  if (!user) {
    window.location.href = '/login';
    return <LoadingSpinner />;
  }

  const renderView = () => {
    switch (view) {
      case 'profile':
        return (<ProfileView user={user} onProfileUpdate={handleProfileUpdate} />);
      case 'orders':
        return <MyOrdersView />; // Placeholder view
      case 'address':
        return <ManageAddressView />; // Placeholder view
      case 'password':
        return <PasswordManagerView />; // Placeholder view
      default:
        return (<ProfileView user={user} onProfileUpdate={handleProfileUpdate} />);
    }
  };

  return (
    <div className={`user-layout ${isMobileMenuOpen ? 'no-scroll' : ''}`}>

      <header className="mobile-header-bar">
        <button className="menu-toggle-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <FiMenu size={24} />
          <span style={{ marginLeft: '10px' }}>Account Menu</span>
        </button>
        <h1 className="mobile-page-title">{view.charAt(0).toUpperCase() + view.slice(1)}</h1>
      </header>

      <div className="dashboard-header">
        <h1 className="header-title">My Account</h1>
        <p className="breadcrumb">Home / <strong>My Account</strong></p>
      </div>

      <div className="dashboard-main">
        <Sidebar
          view={view} setView={setView} onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="dashboard-content">
          {renderView()}
        </div>
      </div>

      <div className="dashboard-footer-icons">
        <div className="footer-icon-item">
          <img src="https://via.placeholder.com/50x50?text=📦" alt="Free Shipping" />
          <h4>Free Shipping</h4>
          <p>Free shipping for order above $50</p>
        </div>
        <div className="footer-icon-item">
          <img src="https://via.placeholder.com/50x50?text=💳" alt="Flexible Payment" />
          <h4>Flexible Payment</h4>
          <p>Multiple secure payment options</p>
        </div>
        <div className="footer-icon-item">
          <img src="https://via.placeholder.com/50x50?text=📞" alt="24x7 Support" />
          <h4>24x7 Support</h4>
          <p>We support online all days.</p>
        </div>
      </div>

      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </div>
  );
};

export default UserDashboard;