import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import api from "../../../core/api/api";
import { downloadInvoice } from "../../../utils/billing/invoice";

export default function Billing() {
  const location = useLocation();

  /* ================= STATES ================= */
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedCodes, setSelectedCodes] = useState({});

  /* ================= LOAD FROM BACKEND ================= */

  const loadOrders = async () => {
    const res = await api.get("/api/orders?status=CREATED,PAID");
    setOrders(res.data || []);
  };

  const loadBills = async () => {
    const res = await api.get("/api/bills");
    setBills(res.data || []);
  };

  const loadInventory = async () => {
    const res = await api.get("/api/inventory");
    setInventory(res.data || []);
  };

  useEffect(() => {
    loadOrders();
    loadBills();
    loadInventory();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    if (orderId) setSelectedOrderId(orderId);
  }, [location.search]);

  /* ================= ORDER ================= */

  const selectedOrder = orders.find(
    o => String(o._id || o.id) === String(selectedOrderId)
  );

  const orderItems = (selectedOrder?.items || []).map(item => {
    const inv = inventory.find(
      v => String(v.variantId) === String(item.variantId)
    );

    return {
      ...item,
      trackingType: inv?.trackingType || "QTY",
      imeis: Array.isArray(inv?.imeis) ? inv.imeis : []
    };
  });

  /* ================= GENERATE BILL ================= */

  const generateBill = async () => {
    if (!selectedOrder || orderItems.length === 0) {
      alert("Select valid order");
      return;
    }

    try {
      await api.post("/billing/generate", {
        orderId: selectedOrder._id || selectedOrder.id,
        selectedCodes
      });

      await loadOrders();
      await loadBills();
      await loadInventory();

      setSelectedOrderId("");
      setSelectedCodes({});

      alert("✅ Bill generated & stock updated");
    } catch (err) {
      alert(err.response?.data?.message || "Billing failed");
    }
  };

  /* ================= CANCEL BILL ================= */

  const cancelBill = async bill => {
    if (!window.confirm("Cancel bill & restore stock?")) return;

    try {
      await api.post("/billing/cancel", {
        billId: bill._id || bill.id
      });

      await loadBills();
      await loadInventory();

      alert("Bill cancelled & stock restored");
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div>
      <h2>🧾 Billing</h2>

      <select
        value={selectedOrderId}
        onChange={e => {
          setSelectedOrderId(e.target.value);
          setSelectedCodes({});
        }}
      >
        <option value="">-- Select Order --</option>
        {orders.map(o => (
          <option key={o._id || o.id} value={o._id || o.id}>
            {o.customerName} — {o.mobile}
          </option>
        ))}
      </select>

      <br /><br />

      {/* IMEI / SERIAL */}
      {orderItems.map((item, index) => {
        if (item.trackingType === "QTY") return null;

        return (
          <div key={index}>
            <b>{item.name}</b>

            {Array.from({ length: item.qty }).map((_, i) => (
              <select
                key={i}
                value={selectedCodes[index]?.[i] || ""}
                onChange={e => {
                  const copy = { ...selectedCodes };
                  const arr = copy[index] || [];
                  arr[i] = e.target.value;
                  copy[index] = arr;
                  setSelectedCodes(copy);
                }}
              >
                <option value="">Select IMEI</option>

                {item.imeis.map(code => (
                  <option
                    key={code}
                    value={code}
                    disabled={Object.values(selectedCodes).flat().includes(code)}
                  >
                    {code}
                  </option>
                ))}
              </select>
            ))}

            <hr />
          </div>
        );
      })}

      <button onClick={generateBill}>Generate Bill</button>

      <hr />

      {/* ================= BILLS ================= */}

      <div style={{ display: "grid", gap: 16 }}>
        {[...bills].reverse().map(bill => {
          const isCancelled = bill.status === "CANCELLED";

          return (
            <div
              key={bill._id || bill.id}
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#fff",
                borderLeft: isCancelled
                  ? "6px solid #dc3545"
                  : "6px solid #198754"
              }}
            >
              <strong>{bill.invoiceNo}</strong>
              <div>Status: {bill.status}</div>

              <ul>
                {bill.items.map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.qty}
                  </li>
                ))}
              </ul>

              <b>Total: ₹{bill.total}</b>

              <div style={{ marginTop: 10 }}>
                <button onClick={() => downloadInvoice(bill)}>
                  Invoice
                </button>

                {!isCancelled && (
                  <button onClick={() => cancelBill(bill)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
