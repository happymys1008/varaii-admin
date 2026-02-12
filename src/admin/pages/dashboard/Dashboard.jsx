import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LowStockList from "./LowStockList";
import { listLowStockInventory } from "../../services/inventoryService";
import { listOrders } from "../../services/orderService";
import { listProducts } from "../../services/productService";
import { listVariants } from "../../services/variantService";

import "./Dashboard.css";
import StatCard from "./StatCard";
import Charts from "./Charts";

export default function Dashboard() {

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef(null);

const totalOrders = orders.length;

const pendingOrders =
  orders.filter(o => o.status === "CREATED").length;

const deliveredOrders =
  orders.filter(o => o.status === "DELIVERED").length;

const cancelledOrders =
  orders.filter(o => o.status === "CANCELLED").length;


  /* 🔔 Bell sound */
  useEffect(() => {
    bellRef.current = new Audio("/bell.mp3");
    bellRef.current.volume = 0.6;
  }, []);

  /* ✨ Blink animation */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes softBlink {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  /* 📦 Load products */
useEffect(() => {
  const loadProducts = async () => {
    try {
      const data = await listProducts();
      setProducts(data);
    } catch (e) {
      console.error("Products API failed", e);
    }
  };

  loadProducts();
}, []);

useEffect(() => {
  const loadVariants = async () => {
    try {
      const data = await listVariants();
      setProductVariants(data);
    } catch (e) {
      console.error("Variants API failed", e);
    }
  };

  loadVariants();
}, []);

useEffect(() => {
  let isActive = true;

  const loadLowStock = async () => {
    try {
      const data = await listLowStockInventory();
      if (isActive) setLowStockItems(data);
    } catch {
      if (isActive) setLowStockItems([]);
    }
  };

  loadLowStock();

  const interval = setInterval(loadLowStock, 15000);
  window.addEventListener("focus", loadLowStock);

  return () => {
    isActive = false;
    clearInterval(interval);
    window.removeEventListener("focus", loadLowStock);
  };
}, []);


/* 🔄 AUTO LOAD + AUTO REFRESH ORDERS */
useEffect(() => {
  let isActive = true;

const loadOrders = async () => {
  try {
    const data = await listOrders();

    // 🔒 HARD SAFETY: always array
    if (isActive) {
      setOrders(Array.isArray(data) ? data : []);
    }
  } catch (e) {
    console.error("Orders API failed", e);

    // 🔒 NEVER let dashboard crash
    if (isActive) setOrders([]);
  }
};


  loadOrders();

  const interval = setInterval(loadOrders, 20000); // auto refresh
  window.addEventListener("focus", loadOrders);

  return () => {
    isActive = false;
    clearInterval(interval);
    window.removeEventListener("focus", loadOrders);
  };
}, []);


  const lowStockCount = lowStockItems.length;

  useEffect(() => {
    if (lowStockCount > 0 && bellRef.current) {
      bellRef.current.currentTime = 0;
      bellRef.current.play().catch(() => {});
    }
  }, [lowStockCount]);




  return (
    <div className="dashboard-root">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>📊 Dashboard Overview</h2>
          <span>Happy Ivan Mobiles · {new Date().toDateString()}</span>
        </div>

        {lowStockCount > 0 && (
          <div
            className="bell"
            onClick={() => setShowLowStock((v) => !v)}
          >
            🔔
            <span className="bell-badge">{lowStockCount}</span>
          </div>
        )}
      </div>


      {/* KPI CARDS */}
{/* KPI CARDS */}
<div className="kpi-grid">

  {/* TOTAL */}
  <div onClick={() => navigate("/admin/orders")}>
    <StatCard
      title="Total Orders"
      value={totalOrders}
      color="blue"
      sub="All time orders"
    />
  </div>

  {/* DELIVERED */}
  <div onClick={() => navigate("/admin/orders?status=DELIVERED")}>
    <StatCard
      title="Delivered Orders"
      value={deliveredOrders}
      color="green"
      sub="Successfully delivered"
    />
  </div>

  {/* PENDING */}
  <div onClick={() => navigate("/admin/orders?status=CREATED")}>
    <StatCard
      title="Pending Orders"
      value={pendingOrders}
      color="orange"
      sub="Needs attention"
    />
  </div>

  {/* CANCELLED */}
  <div onClick={() => navigate("/admin/orders?status=CANCELLED")}>
    <StatCard
      title="Cancelled Orders"
      value={cancelledOrders}
      color="red"
      sub="Orders cancelled"
    />
  </div>

  {/* LOW STOCK */}
  <div
    className="low-stock-hero"
    onClick={() => navigate("/admin/inventory/mobiles")}
  >
    <h4>⚠️ Low Stock</h4>
    <h1>{lowStockCount}</h1>
    <span>Immediate action required</span>
  </div>

</div>


      {/* CHARTS */}
      <Charts />
     {/* ==== LOW STOCK LIST ==== */}
    {showLowStock && (
      <LowStockList
        items={lowStockItems}
        products={products}
        variants={productVariants}
        onViewAll={() => navigate("/admin/inventory/mobiles")}
      />
    )}
    </div>
  );
}
