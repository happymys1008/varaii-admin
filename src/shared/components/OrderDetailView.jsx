import { useNavigate } from "react-router-dom";
import { formatOrderDate } from "../../utils/common/dateFormat";
export default function OrderDetailView({ order, role = "customer" }) {
  const navigate = useNavigate();

  if (!order) {
    return <p style={{ padding: 20 }}>Order not found</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h2>
        {role === "admin" ? "Admin Order Detail" : "My Order Detail"}
      </h2>

      <p><b>Order No:</b> {order.orderNo}</p>
      <p><b>Order Date:</b> {formatOrderDate(order.createdAt)}</p>

      <p>
        <b>Status:</b>{" "}
        <span style={{ fontWeight: 600 }}>{order.status}</span>
      </p>

      <p>
        <b>Payment:</b> {order.paymentMode} ({order.paymentStatus})
      </p>

      <p>
        <b>Total:</b> ₹{order.grandTotal ?? order.total}
      </p>

      <hr />

      <h4>Customer</h4>
      <p>
        <b>Name:</b> {order.customerName}<br />
        <b>Mobile:</b> {order.customerMobile}
      </p>

      <hr />

      <h4>Delivery Address</h4>
      <p>
        <b>{order.deliveryAddress?.name}</b><br />
        {order.deliveryAddress?.phone}<br />
        {[order.deliveryAddress?.line1,
          order.deliveryAddress?.line2,
          order.deliveryAddress?.city,
          order.deliveryAddress?.state]
          .filter(Boolean)
          .join(", ")}<br />
        PIN: {order.deliveryAddress?.pincode}
      </p>

      <hr />

      <h4>Items</h4>
      {order.items?.map((i, idx) => (
        <div key={idx}>
          {i.name} × {i.qty} — ₹{i.price * i.qty}
        </div>
      ))}

      <hr />

      <button
        onClick={() => navigate(-1)}
        style={{
          background: "black",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        ← Back
      </button>
    </div>
  );
}