import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 14px",
    marginBottom: 6,
    textDecoration: "none",
    borderRadius: 6,
    cursor: "pointer",
    background: isActive ? "#0b5ed7" : "transparent",
    color: "white"
  });

  const sectionTitle = {
    fontSize: 12,
    color: "#9ca3af",
    margin: "14px 0 6px"
  };

  return (
    <div
      style={{
        width: 220,
        background: "#111",
        color: "white",
        minHeight: "100vh",
        padding: 20
      }}
    >
      <h3 style={{ marginBottom: 20 }}>Admin</h3>

      {/* ===== DASHBOARD ===== */}
      <NavLink to="/admin/dashboard" style={linkStyle}>
        📊 Dashboard
      </NavLink>

      {/* ===== ORDERS ===== */}
      <NavLink to="/admin/orders" style={linkStyle}>
        📦 Orders
      </NavLink>

      {/* ===== CUSTOMERS ===== */}
      <div style={sectionTitle}>Customers</div>

      <NavLink to="/admin/customers" style={linkStyle}>
        👤 Customers
      </NavLink>

      {/* ===== PRODUCTS ===== */}
      <NavLink to="/admin/products" style={linkStyle}>
        📱 Products
      </NavLink>

      {/* ===== HOME ===== */}
      <div style={sectionTitle}>Home</div>

      <NavLink to="/admin/home/sections" style={linkStyle}>
        🏠 Home Sections
      </NavLink>

      <NavLink to="/admin/home/banners" style={linkStyle}>
        🖼️ Home Banners
      </NavLink>

      {/* ===== INVENTORY ===== */}
      <div style={sectionTitle}>Inventory</div>

      <NavLink to="/admin/inventory" style={linkStyle}>
        📦 Inventory
      </NavLink>

      {/* ===== DELIVERY (IMPORTANT FIX HERE) ===== */}
      <div style={sectionTitle}>Delivery</div>

      <NavLink to="/admin/delivery/pincodes" style={linkStyle}>
        📮 Pincode Delivery
      </NavLink>

      <NavLink to="/admin/settings/payments" style={linkStyle}>
        💳 Payment Settings
      </NavLink>

      {/* ===== REVIEWS ===== */}
      <div style={sectionTitle}>Reviews</div>

      <NavLink to="/admin/reviews" style={linkStyle}>
        ⭐ Reviews
      </NavLink>

      {/* ===== PURCHASE ===== */}
      <div style={sectionTitle}>Purchase</div>

      <NavLink to="/admin/purchase" style={linkStyle}>
        🧾 Purchase
      </NavLink>

      <NavLink to="/admin/purchase-register" style={linkStyle}>
        📑 Purchase Register
      </NavLink>

      {/* ===== CATALOG ===== */}
      <div style={sectionTitle}>Catalog</div>

      <NavLink to="/admin/categories" style={linkStyle}>
        🗂️ Categories
      </NavLink>

      <NavLink to="/admin/brands" style={linkStyle}>
        🏷️ Brands
      </NavLink>

      <NavLink to="/admin/catalog/attributes" style={linkStyle}>
        🧩 Attributes
      </NavLink>

      {/* ===== BILLING ===== */}
      <NavLink to="/admin/billing" style={linkStyle}>
        🧾 Billing
      </NavLink>

      {/* ===== SETTINGS ===== */}
      <div style={sectionTitle}>Settings</div>

      <NavLink
        to="/admin/settings/profile-schema"
        style={linkStyle}
      >
        🧩 Profile Schema
      </NavLink>

      <NavLink
        to="/admin/settings/account-sidebar"
        style={linkStyle}
      >
        🧭 Account Sidebar
      </NavLink>
    </div>
  );
}