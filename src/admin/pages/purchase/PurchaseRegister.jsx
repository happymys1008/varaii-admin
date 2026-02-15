import { useEffect, useState } from "react";
import api from "../../../core/api/api";

export default function PurchaseRegister() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  /* ================= LOAD ================= */
  const loadData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        api.get("/purchases"),
        api.get("/suppliers"),
      ]);

      setPurchases(pRes.data || []);
      setSuppliers(sRes.data || []);
    } catch (err) {
      console.error("Failed loading purchase register", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= HELPERS ================= */

  // Supplier ID → Name
  const getSupplierName = (supplierId) => {
    const s = suppliers.find(
      (x) => String(x._id || x.id) === String(supplierId)
    );
    return s?.name || "Unknown Supplier";
  };

  const getPurchaseTotal = (purchase) => {
    return (purchase.items || []).reduce(
      (sum, i) => sum + (i.qty || 0) * (i.costPrice || 0),
      0
    );
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this purchase?\nStock will be reversed."
    );
    if (!ok) return;

    try {
      await api.delete(`/purchases/${id}`);
      loadData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-page">
      <h2 style={{ marginBottom: 16 }}>Purchase Register</h2>

      {purchases.length === 0 ? (
        <p>No purchases found</p>
      ) : (
        <table
          className="admin-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={th}>Date</th>
              <th style={th}>Invoice No</th>
              <th style={th}>Supplier</th>
              <th style={{ ...th, textAlign: "right" }}>Total</th>
              <th style={{ ...th, textAlign: "center" }}>Status</th>
              <th style={{ ...th, textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {purchases
              .filter((p) => p.status === "ACTIVE")
              .map((p) => (
                <tr
                  key={p._id || p.id}
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <td style={td}>
                    {p.invoiceDate
                      ? new Date(p.invoiceDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td style={td}>{p.invoiceNo || "-"}</td>

                  <td style={td}>
                    {getSupplierName(p.supplierId)}
                  </td>

                  <td style={{ ...td, textAlign: "right" }}>
                    ₹{getPurchaseTotal(p)}
                  </td>

                  <td style={{ ...td, textAlign: "center" }}>
                    {p.status}
                  </td>

                  <td style={{ ...td, textAlign: "center" }}>
                    <button
                      style={deleteBtn}
                      onClick={() =>
                        handleDelete(p._id || p.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const th = {
  padding: "10px",
  fontSize: 14,
  fontWeight: 600,
  textAlign: "left",
  borderBottom: "2px solid #d1d5db",
};

const td = {
  padding: "10px",
  fontSize: 14,
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer",
};
