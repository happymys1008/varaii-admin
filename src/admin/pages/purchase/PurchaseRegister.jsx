import { useEffect, useState } from "react";
import {
  getPurchaseRegister,
  deletePurchase,
  getItemsByPurchase
} from "../../../utils/billing/purchaseUtils";

export default function PurchaseRegister() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  /* ================= LOAD ================= */
  const loadPurchases = () => {
    const data = getPurchaseRegister();
    setPurchases(data);
  };

  useEffect(() => {
    loadPurchases();

    setSuppliers(
      JSON.parse(localStorage.getItem("suppliers")) || []
    );
  }, []);

  /* ================= HELPERS ================= */

  // Supplier ID → Name
  const getSupplierName = (supplierId) => {
    const s = suppliers.find(
      x => String(x.id) === String(supplierId)
    );
    return s?.name || "Unknown Supplier";
  };

  // Purchase Total (from purchase_items)
  const getPurchaseTotal = (purchaseId) => {
    const items = getItemsByPurchase(purchaseId);

    return items.reduce(
      (sum, i) => sum + i.qty * i.costPrice,
      0
    );
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
            background: "#fff"
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
              .filter(p => p.status === "ACTIVE")
              .map(p => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb"
                  }}
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
                    ₹{getPurchaseTotal(p.id)}
                  </td>

                  <td style={{ ...td, textAlign: "center" }}>
                    {p.status}
                  </td>

                  <td style={{ ...td, textAlign: "center" }}>
                    <button
                      style={deleteBtn}
                      onClick={() => {
                        const ok = window.confirm(
                          "Delete this purchase?\nStock will be reversed."
                        );
                        if (!ok) return;

                        deletePurchase(p.id);
                        loadPurchases();
                      }}
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
  borderBottom: "2px solid #d1d5db"
};

const td = {
  padding: "10px",
  fontSize: 14
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 4,
  cursor: "pointer"
};
