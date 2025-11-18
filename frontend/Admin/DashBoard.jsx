import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

// Icons
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
} from "react-icons/fi";

// CSS
import "./DashBoard.css";

// Auth
import { AuthContext } from "../Context/AuthContext";

const BaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// FIXED CLEAN URL
const cleanUrl = (path) => {
  if (!path || !path.trim()) return null;
  if (path.startsWith("http")) return path;
  return `${BaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};


/* ================================================================
   SIDEBAR
================================================================ */
const Sidebar = ({ view, setView, user }) => {
  const navItems = [
    { name: "Dashboard", icon: <FiLayout />, view: "dashboard" },
    { name: "Orders", icon: <FiShoppingCart />, view: "orders" },
    { name: "Products", icon: <FiPackage />, view: "products" },
    { name: "Users", icon: <FiUsers />, view: "users" },
  ];

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
                className={`sidebar-nav-item ${view === item.view ? "active" : ""
                  }`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-user-name">{user?.username || "Admin"}</p>
        <p className="sidebar-user-email">{user?.email}</p>
      </div>
    </div>
  );
};

/* ================================================================
   REUSABLE COMPONENTS
================================================================ */
const StatCard = ({ title, value, icon, iconClass = "" }) => (
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
================================================================ */
const ProductModal = ({ product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState(
    product || {
      _id: "",
      name: "",
      price: 0,
      image: "",
      images: [],
      category: "",
      stock: 0,
      description: "",
    }
  );

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const isEditing = !!product;

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setUploadError("");
    setUploadSuccess("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    const fd = new FormData();
    fd.append("image", imageFile);

    try {
      const res = await axios.post(cleanUrl("/api/upload"), fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setFormData((prev) => ({ ...prev, image: res.data.url }));
      setUploadSuccess("Image uploaded successfully!");
    } catch (err) {
      setUploadError(
        "Image upload failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, isEditing);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>
          <button className="modal-close" onClick={onClose}>
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
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
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
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>

            {/* Upload Image */}
            <div className="form-group">
              <label>Upload Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !imageFile}
                className="button button-secondary"
                style={{ marginLeft: "10px" }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>

              {uploadError && (
                <div className="error-message">{uploadError}</div>
              )}
              {uploadSuccess && (
                <div className="success-message">{uploadSuccess}</div>
              )}

              {formData.image?.trim() && (
                <img
                  src={cleanUrl(formData.image)}
                  alt="Preview"
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}

            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={onClose}
              >
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
================================================================ */
const DashboardView = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [ordersRes, usersRes, productsRes] = await Promise.all([
          axios.get(cleanUrl("/api/orders"), { withCredentials: true }),
          axios.get(cleanUrl("/api/users"), { withCredentials: true }),
          axios.get(cleanUrl("/api/products"), { withCredentials: true }),
        ]);

        const orders = ordersRes.data;
        const users = usersRes.data;
        const products = productsRes.data;

        const revenue = orders
          .filter((o) => o.isPaid)
          .reduce((sum, o) => sum + o.totalPrice, 0);

        const newCustomers = users.filter(
          (u) =>
            new Date(u.createdAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        const lowStock = products.filter((p) => p.stock <= 5).length;

        setStats({
          totalRevenue: revenue.toFixed(2),
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

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="page-view">
      <h2 className="page-title">Dashboard</h2>

      <div className="stat-card-grid">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={<FiDollarSign />}
          iconClass="icon-green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FiShoppingCart />}
          iconClass="icon-blue"
        />
        <StatCard
          title="New Customers (30d)"
          value={stats.newCustomers}
          icon={<FiUsers />}
          iconClass="icon-purple"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={<FiPackage />}
          iconClass="icon-red"
        />
      </div>
    </div>
  );
};

/* ================================================================
   ORDERS VIEW
================================================================ */
const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(cleanUrl("/api/orders"), {
          withCredentials: true,
        });
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="page-view">
      <h2 className="page-title">Orders</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.user?.email}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>₹{o.totalPrice}</td>
                <td>
                  {o.isPaid ? (
                    <span className="status-badge status-paid">Paid</span>
                  ) : (
                    <span className="status-badge status-not-paid">
                      Not Paid
                    </span>
                  )}
                </td>
                <td>
                  {o.isDelivered ? (
                    <span className="status-badge status-delivered">
                      Delivered
                    </span>
                  ) : (
                    <span className="status-badge status-processing">
                      Processing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================================================================
   PRODUCTS VIEW
================================================================ */
const ProductsView = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(cleanUrl("/api/products"), {
        withCredentials: true,
      });
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(cleanUrl("/api/categories"), {
        withCredentials: true,
      });
      setCategories(data);
    } catch { }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSave = async (productData, isEditing) => {
    try {
      const payload = {
        ...productData,
        user: user._id,
        images: [
          {
            url: productData.image,
            alt: productData.name,
          },
        ],
      };

      if (isEditing) {
        await axios.put(
          cleanUrl(`/api/products/${productData._id}`),
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(cleanUrl("/api/products"), payload, {
          withCredentials: true,
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="page-view">
      <div className="header-bar">
        <h2 className="page-title">Products</h2>

        <button
          className="button button-primary"
          onClick={() => {
            setProductToEdit(null);
            setShowModal(true);
          }}
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              
              <tr key={p._id}>
                <td>
                  <img
                    src={cleanUrl(p.images?.[0]?.url || p.image)}
                    alt={p.name}
                    className="table-image"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/50x50")
                    }
                  />
                  {console.log("Product:", p)}
                  {console.log("Image URL:", p.images?.[0]?.url, p.image)}
                  
                </td>

                <td>{p._id}</td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>

                <td>
                  {p.stock <= 5 ? (
                    <span className="status-badge status-not-paid">
                      {p.stock} (Low)
                    </span>
                  ) : (
                    p.stock
                  )}
                </td>

                <td>{p.category?.name || p.category}</td>

                <td>
                  <button
                    className="action-button-edit"
                    onClick={() => {
                      setProductToEdit(p);
                      setShowModal(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="action-button-delete"
                    onClick={async () => {
                      if (window.confirm("Delete this product?")) {
                        await axios.delete(
                          cleanUrl(`/api/products/${p._id}`),
                          { withCredentials: true }
                        );
                        fetchProducts();
                      }
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
================================================================ */
const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await axios.get(cleanUrl("/api/users"), {
          withCredentials: true,
        });
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-view">
      <h2 className="page-title">Users</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Name</th>
              <th>Admin</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>{u.email}</td>
                <td>{u.mobilenum}</td>
                <td>{u.username}</td>
                <td>
                  {u.isAdmin ? (
                    <span className="status-badge status-paid">Yes</span>
                  ) : (
                    <span className="status-badge status-processing">No</span>
                  )}
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN ADMIN DASHBOARD
================================================================ */
const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");
  const { user } = useContext(AuthContext);

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <DashboardView />;
      case "orders":
        return <OrdersView />;
      case "products":
        return <ProductsView user={user} />;
      case "users":
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
