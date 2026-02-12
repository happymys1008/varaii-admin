import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatOrderDate } from "../../../utils/common/dateFormat";
import { listOrdersByCustomer } from "../../services/orderService";

export default function CustomerOrders({ customerId }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customerId) return;

    async function loadOrders() {
      try {
        const res = await listOrdersByCustomer(customerId);

        // ✅ SAFE NORMALIZATION
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];

        setOrders(list);
      } catch (err) {
        console.error("Failed to load customer orders", err);
        setOrders([]);
      }
    }

    loadOrders();
  }, [customerId]);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Orders</h3>

      {orders.length === 0 ? (
        <p style={{ color: "#777" }}>No orders found</p>
      ) : (
        <table border="1" cellPadding="8" width="100%">
          <thead>
            <tr>
              <th>Order No</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => {
              const orderId = o._id || o.id;

              return (
                <tr key={orderId}>
                  <td>{o.orderNo || orderId}</td>

                  {/* ✅ single source of truth */}
                  <td>{formatOrderDate(o.createdAt)}</td>

                  <td>{o.status || "-"}</td>
                  <td>₹{o.grandTotal ?? o.total ?? 0}</td>

                  <td>
                    <button
                      onClick={() =>
                        navigate(`/admin/orders/${orderId}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
