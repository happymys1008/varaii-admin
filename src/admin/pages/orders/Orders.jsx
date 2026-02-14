import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatOrderDate } from "../../../utils/common/dateFormat";

export default function Orders({
  orders = [],
  updateOrderStatus
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const statusFilter = params.get("status");

  const filteredOrders = orders
    .filter(o => {
      if (!statusFilter) return o.status !== "CANCELLED";
      return o.status === statusFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const cancelledOrders = orders
    .filter(o => o.status === "CANCELLED")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 20
      }}
    >
      {/* FILTERS */}
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, flexWrap: "wrap" }}>
        <FilterChip label="All" active={!statusFilter} onClick={() => navigate("/admin/orders")} />
        <FilterChip label="Created" active={statusFilter === "CREATED"} onClick={() => navigate("/admin/orders?status=CREATED")} />
        <FilterChip label="Paid" active={statusFilter === "PAID"} onClick={() => navigate("/admin/orders?status=PAID")} />
        <FilterChip label="Packed" active={statusFilter === "PACKED"} onClick={() => navigate("/admin/orders?status=PACKED")} />
        <FilterChip label="Shipped" active={statusFilter === "SHIPPED"} onClick={() => navigate("/admin/orders?status=SHIPPED")} />
        <FilterChip label="Delivered" active={statusFilter === "DELIVERED"} onClick={() => navigate("/admin/orders?status=DELIVERED")} />
        <FilterChip label="Cancelled" active={statusFilter === "CANCELLED"} danger onClick={() => navigate("/admin/orders?status=CANCELLED")} />
      </div>

      {/* ACTIVE ORDERS */}
      {filteredOrders.map(o => {
        const orderId = o._id;

        return (
          <div
            key={orderId}
            onClick={() => navigate(`/admin/orders/${orderId}`)}
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 10,
              background: "white"
            }}
          >
            <b>Order {o.orderNo}</b>

            <p style={{ fontSize: 13 }}>
              <b>Ordered:</b> {formatOrderDate(o.createdAt)}
            </p>

            <p><b>Name:</b> {o.customerName}</p>
            <p><b>Mobile:</b> {o.customerMobile}</p>
            <p><b>Status:</b> {o.status}</p>
            <p><b>Payment:</b> {o.paymentStatus}</p>
            <p><b>Total:</b> ₹{o.grandTotal}</p>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {o.status === "CREATED" && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  updateOrderStatus(orderId, "PAID");
                }}>
                  Mark Paid
                </button>
              )}

              {o.status === "PAID" && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  updateOrderStatus(orderId, "PACKED");
                }}>
                  Mark Packed
                </button>
              )}

              {o.status === "PACKED" && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  updateOrderStatus(orderId, "SHIPPED");
                }}>
                  Mark Shipped
                </button>
              )}

              {o.status === "SHIPPED" && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  updateOrderStatus(orderId, "DELIVERED");
                }}>
                  Mark Delivered
                </button>
              )}

              {o.status !== "CANCELLED" && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  if (!window.confirm("Cancel this order?")) return;
                  updateOrderStatus(orderId, "CANCELLED");
                }}>
                  Cancel
                </button>
              )}
            </div>

            <ul>
              {o.items?.map((it, i) => (
                <li key={i}>{it.name} × {it.quantity}</li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* CANCELLED */}
      {cancelledOrders.map(o => (
        <div
          key={o._id}
          style={{
            border: "1px solid #f5c2c7",
            padding: 16,
            borderRadius: 10,
            background: "#fff5f5"
          }}
        >
          <b>Order {o.orderNo}</b>
          <p>{o.customerName}</p>
          <p style={{ color: "red" }}>CANCELLED</p>
        </div>
      ))}
    </div>
  );
}

function FilterChip({ label, active, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        border: "1px solid",
        background: active ? (danger ? "#dc3545" : "#0d6efd") : "#f8f9fa",
        color: active ? "#fff" : danger ? "#dc3545" : "#333",
        cursor: "pointer"
      }}
    >
      {label}
    </button>
  );
}
