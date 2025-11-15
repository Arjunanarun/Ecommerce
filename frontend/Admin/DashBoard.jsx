import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import axios from 'axios';

// Import 'react-icons'
import {
  FiLayout,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';

// Import the CSS file
import './DashBoard.css';

// Import your AuthContext
import { AuthContext } from '../Context/AuthContext';

const BaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper function to safely join URLs
const cleanUrl = (path) => {
  return `${BaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

/* ================================================================
   SIDEBAR
=================================================================== */
const Sidebar = ({ view, setView, user }) => {
  const navItems = [
    { name: 'Dashboard', icon: <FiLayout />, view: 'dashboard' },
    { name: 'Orders', icon: <FiShoppingCart />, view: 'orders' },
    { name: 'Products', icon: <FiPackage />, view: 'products' },
    { name: 'Users', icon: <FiUsers />, view: 'users' },
  ];
  console.log("Logged-in user:", user);
  console.log("Sidebar user prop:", user);
  console.log("Sidebar user.username:", user?.username);
  console.log("Sidebar user.email:", user?.email);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Admin Panel</span>
      </div>

      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setView(item.view)}
                className={`sidebar-nav-item ${view === item.view ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <p className="sidebar-user-name">{user?.username || 'Admin User'}</p>
        <p className="sidebar-user-email">{user?.email}</p>
      </div>
    </div>
  );
};

/* ================================================================
   REUSABLE COMPONENTS
=================================================================== */

const StatCard = ({ title, value, icon, iconClass = '' }) => (
  <div className="stat-card">
    <div className="stat-card-info">
      <p className="stat-card-title">{title}</p>
      <p className="stat-card-value">{value}</p>
    </div>
    <div className={`stat-card-icon ${iconClass}`}>{icon}</div>
  </div>
);

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

/* ================================================================
   PRODUCT MODAL
=================================================================== */
const ProductModal = ({ product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState(
    product || {
      _id: '',
      name: '',
      price: 0,
      image: 'https://placehold.co/400x400/9ca3af/white?text=New',
      category: '',
      countInStock: 0,
      description: '',
    }
  );

  const isEditing = !!product;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEditing);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="modal-close-button">
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Price + Stock */}
            <div className="form-group-row">
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Count In Stock</label>
                <input
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" className="button button-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   DASHBOARD VIEW
=================================================================== */
const DashboardView = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [ordersRes, usersRes, productsRes] = await Promise.all([
          axios.get(cleanUrl('/api/orders'), { withCredentials: true }),
          axios.get(cleanUrl('/api/users'), { withCredentials: true }),
          axios.get(cleanUrl('/api/products'), { withCredentials: true }),
        ]);

        const orders = ordersRes.data;
        const users = usersRes.data;
        const products = productsRes.data;

        const totalRevenue = orders
          .filter(o => o.isPaid)
          .reduce((acc, order) => acc + order.totalPrice, 0);

        const newCustomers = users.filter(
          u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const lowStock = products.filter(p => p.countInStock <= 5).length;

        setStats({
          totalRevenue: totalRevenue.toFixed(2),
          totalOrders: orders.length,
          newCustomers,
          lowStock,
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="page-view">
      
      <h2 className="page-title">Dashboard</h2>

      <div className="stat-card-grid">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} icon={<FiDollarSign />} iconClass="icon-green" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<FiShoppingCart />} iconClass="icon-blue" />
        <StatCard title="New Customers (30d)" value={stats.newCustomers} icon={<FiUsers />} iconClass="icon-purple" />
        <StatCard title="Low Stock Items" value={stats.lowStock} icon={<FiPackage />} iconClass="icon-red" />
      </div>
    </div>
  );
};

/* ================================================================
   ORDERS VIEW
=================================================================== */
const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(cleanUrl('/api/orders'), {
          withCredentials: true,
        });
        setOrders(data);
      } catch (err) {
        setError(err.message);
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
      <h2 className="page-title">Orders Management</h2>

      <div className="table-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid (COD)</th>
                <th>Delivered</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.email || order.user}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? <span className="status-badge status-paid">Paid</span> : <span className="status-badge status-not-paid">Not Paid</span>}</td>
                  <td>{order.isDelivered ? <span className="status-badge status-delivered">Delivered</span> : <span className="status-badge status-processing">Processing</span>}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

/* ================================================================
   PRODUCTS VIEW
=================================================================== */
const ProductsView = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Store categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(cleanUrl('/api/products'), {
        withCredentials: true,
      });
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(cleanUrl('/api/categories'), {
          withCredentials: true,
        });
        setCategories(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateNew = () => {
    setProductToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setShowModal(true);
  };

  const handleDelete = async(productId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(cleanUrl(`/api/products/${productId}`), {
          withCredentials: true,
        });
        fetchProducts();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSave = async (productData, isEditing) => {
    try {
      let categoryId = productData.category;
      // If category is not an ObjectId, find it in categories
      if (categories.length && typeof categoryId === 'string' && categoryId.length !== 24) {
        const found = categories.find(c => c.name === categoryId);
        if (found) categoryId = found._id;
      }
      const payload = { ...productData, category: categoryId, user: user._id };
      if (isEditing) {
        await axios.put(cleanUrl(`/api/products/${productData._id}`), payload, {
          withCredentials: true
        });
      } else {
        if (!user || !user._id) {
          alert("No admin ID found");
          return;
        }
        await axios.post(cleanUrl('/api/products'), payload, { withCredentials: true });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddCategory = async (name) => {
    try {
      await axios.post(cleanUrl('/api/categories'), { name }, { withCredentials: true });
      // Refresh categories after adding
      const { data } = await axios.get(cleanUrl('/api/categories'), { withCredentials: true });
      setCategories(data);
      alert('Category added successfully');
    } catch (err) {
      alert('Error adding category: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="page-view">
      <div className="header-bar">
        <h2 className="page-title">Products Management</h2>
        <button className="button button-primary" onClick={handleCreateNew}>
          <FiPlus style={{ marginRight: '8px' }} /> Add Product
        </button>
        {/* Add Category UI */}
        <form style={{ display: 'inline-block', marginLeft: '16px' }}
          onSubmit={e => {
            e.preventDefault();
            const name = e.target.categoryName.value.trim();
            if (name) handleAddCategory(name);
            e.target.reset();
          }}>
          <input name="categoryName" type="text" placeholder="New Category" className="form-input" style={{ width: '160px', marginRight: '8px' }} />
          <button type="submit" className="button button-secondary">Add Category</button>
        </form>
      </div>

      <div className="table-container">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="table-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/50x50";
                      }}
                    />
                  </td>

                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>

                  <td>
                    {product.countInStock <= 5 ? (
                      <span className="status-badge status-not-paid">
                        {product.countInStock} (Low)
                      </span>
                    ) : (
                      product.countInStock
                    )}
                  </td>

                  <td>{product.category}</td>

                  <td>
                    <div className="action-button-group">
                      <button className="action-button-edit" onClick={() => handleEdit(product)}>
                        <FiEdit />
                      </button>
                      <button className="action-button-delete" onClick={() => handleDelete(product._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={productToEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          categories={categories}
        />
      )}
    </div>
  );
};

/* ================================================================
   USERS VIEW
=================================================================== */
const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(cleanUrl('/api/users'), {
          withCredentials: true,
        });
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="page-view">
      <h2 className="page-title">Users Management</h2>

      <div className="table-container">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Username</th>
                <th>Admin</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.email}</td>
                  <td>{user.mobilenum}</td>
                  <td>{user.username || "N/A"}</td>
                  <td>
                    {user.isAdmin ? (
                      <span className="status-badge status-paid">Yes</span>
                    ) : (
                      <span className="status-badge status-processing">No</span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

    </div>
  );
};

/* ================================================================
   MAIN COMPONENT (AdminDashboard)
=================================================================== */
const AdminDashboard = () => {
  const [view, setView] = useState('dashboard');
  const { user } = useContext(AuthContext);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView />;
      case 'orders':
        return <OrdersView />;
      case 'products':
        return <ProductsView user={user} />;
      case 'users':
        return <UsersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar view={view} setView={setView} user={user} />
      <div className="main-content">{renderView()}</div>
    </div>
  );
};

export default AdminDashboard;
