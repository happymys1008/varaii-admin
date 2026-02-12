import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import {
  listOrders,
  updateOrderStatus
} from "../services/orderService";

// ✅ ADD THIS IMPORT
import { AdminCatalogProvider } from "../context/AdminCatalogContext";

// admin components
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

// admin pages
import Dashboard from "./dashboard/Dashboard";
import Purchase from "./purchase/Purchase";
import PurchaseRegister from "./purchase/PurchaseRegister";

import CustomersDashboard from "./customers/CustomersDashboard";
import CustomerDetails from "./customers/CustomerDetails";

import ProfileSchemaSettings from "./settings/ProfileSchemaSettings";
import AccountSidebarSettings from "./settings/AccountSidebarSettings";

import AdminOrderDetail from "./customers/AdminOrderDetail";
// Home CMS
import HomeSections from "./home/HomeSections";
import HomeBanners from "./home/HomeBanners";

// Catalog
import Categories from "./catalog/Categories";
import Brands from "./catalog/Brands";
import ProductsRoutes from "./products/ProductsRoutes";

// Inventory
import InventoryCategory from "./inventory/InventoryCategory";

import PincodeDashboard from "./delivery/PincodeDashboard";
import PaymentSettings from "./settings/PaymentSettings";

// Orders
import Orders from "./orders/Orders";
import Billing from "./orders/Billing";

import { downloadInvoice } from "../../utils/billing/invoice";


import ProductAttributes from "./catalog/ProductAttributes";
import ProductView from "./catalog/ProductView";
import ProductVariants from "./products/ProductVariants";

import ReviewsDashboard from "./reviews/ReviewsDashboard";

export default function Admin() {
  /* ================= ADMIN LOGIN ================= */
  const [adminLogged, setAdminLogged] = useState(
    localStorage.getItem("adminLogged") === "true"
  );
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState("");

  /* ================= DATA ================= */
  const [orders, setOrders] = useState([]);

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      const list = await listOrders();
      if (isActive) setOrders(list || []);
    };

    loadOrders();
    const interval = setInterval(loadOrders, 15000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      const list = await listOrders();
      setOrders(list || []);
    } catch (err) {
      alert(err.message || "Failed to update order status");
    }
  };

  /* ================= LOGIN SCREEN ================= */
  if (!adminLogged) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Admin Login – HAPPY IVAN</h2>

        <input
          placeholder="Admin ID"
          value={adminId}
          onChange={e => setAdminId(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          value={adminPass}
          onChange={e => setAdminPass(e.target.value)}
        /><br /><br />

        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <button
          onClick={() => {
            if (adminId === "admin" && adminPass === "Happy@9982649982") {
              localStorage.setItem("adminLogged", "true");
              setAdminLogged(true);
            } else {
              setLoginError("Wrong Admin ID or Password");
            }
          }}
        >
          Login
        </button>
      </div>
    );
  }

  /* ================= ADMIN PANEL ================= */
  return (
    // 🔥🔥 WRAP ADMIN WITH PROVIDER 🔥🔥
    <AdminCatalogProvider>
      <div>
        <AdminHeader />

        <div style={{ display: "flex" }}>
          <AdminSidebar />

          <div style={{ flex: 1, padding: 20 }}>
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />

              <Route path="home/sections" element={<HomeSections />} />
              <Route path="home/banners" element={<HomeBanners />} />

              <Route
                path="orders"
                element={
                  <Orders
                    orders={orders}
                    updateOrderStatus={handleUpdateOrderStatus}
                    downloadInvoice={downloadInvoice}
                  />
                }
              />

              <Route path="categories" element={<Categories />} />
              <Route path="brands" element={<Brands />} />
              <Route path="catalog/attributes" element={<ProductAttributes />} />

              <Route path="inventory" element={<InventoryCategory />} />
              <Route path="delivery/pincodes" element={<PincodeDashboard />} />

              <Route path="billing" element={<Billing />} />
              <Route path="purchase" element={<Purchase />} />
              <Route path="purchase-register" element={<PurchaseRegister />} />

              <Route path="reviews" element={<ReviewsDashboard />} />
              <Route path="products/*" element={<ProductsRoutes />} />

              <Route path="settings/payments" element={<PaymentSettings />} />

              <Route path="customers" element={<CustomersDashboard />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              

              <Route
                path="orders/:orderId"
                element={<AdminOrderDetail />}
              />

              <Route
                path="settings/profile-schema"
                element={<ProfileSchemaSettings />}
              />

              <Route
                path="settings/account-sidebar"
                element={<AccountSidebarSettings />}
              />

              <Route path="products/:id" element={<ProductView />} />
              <Route
                path="products/:id/variants"
                element={<ProductVariants />}
              />
            </Routes>

            <br />

            <button
              onClick={() => {
                localStorage.removeItem("adminLogged");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </AdminCatalogProvider>
  );
}
