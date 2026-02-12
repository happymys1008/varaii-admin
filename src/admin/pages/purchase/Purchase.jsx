import { useEffect, useState } from "react";
import PurchaseProductSelector from "./PurchaseProductSelector";
import { createPurchaseApi } from "../../services/purchaseService";
import { listVariants } from "../../services/variantService";

import {
  listSuppliers,
  createSupplier
} from "../../services/supplierService";





export default function Purchase() {
  /* ========= DATA ========= */
  const [suppliers, setSuppliers] = useState([]);

  /* ========= FORM ========= */
  const [supplierId, setSupplierId] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date] = useState(new Date().toISOString().slice(0, 10));

/* ========= LOAD SUPPLIERS (BACKEND) ========= */
useEffect(() => {
  const loadSuppliers = async () => {
    try {
      const data = await listSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Supplier load failed", err);
      alert("Failed to load suppliers");
    }
  };

  loadSuppliers();
}, []);




  /* ========= MULTI ITEM ========= */
  const [items, setItems] = useState([
    {
      id: Date.now(),
      product: null,
      variant: null,
      qty: 1,
      costPrice: "",
      imeis: []
    }
  ]);

  /* ========= IMEI DRAWER ========= */
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState(null);





/* ========= ADD SUPPLIER (BACKEND) ========= */
const addSupplier = async () => {
  if (!newSupplier.trim()) return;

  try {
    const supplier = await createSupplier(newSupplier);

    setSuppliers(prev => [...prev, supplier]);
    setSupplierId(supplier._id); // 🔥 IMPORTANT
    setNewSupplier("");
  } catch (err) {
    alert(err?.message || "Supplier create failed");
  }
};


  /* ========= SAVE PURCHASE ========= */
  const savePurchase = async () => {
    // ✅ SINGLE SOURCE OF TRUTH
    const validItems = items.filter(
      row => row && row.product && row.product.id
    );

    // 🔒 DUPLICATE GUARD
    const seen = new Set();
    for (let row of validItems) {
      const key = `${row.product.id}__${row.variant?._id || "NO_VARIANT"}`;
      if (seen.has(key)) {
        alert(`❌ Same product & variant added twice: ${row.product.name}`);
        return;
      }
      seen.add(key);
    }

    if (!supplierId || validItems.length === 0) {
      alert("Supplier & at least one item required");
      return;
    }

    for (let row of validItems) {
      if (!row.costPrice || row.qty <= 0) {
        alert("Please fill all rows properly");
        return;
      }
    }

    try {
      await createPurchaseApi({
        invoiceNo,
        supplierId,
        invoiceDate: date,
        items: validItems.map(row => ({
          productId: row.product.id,
          variantId: row.product.allowVariants ? row.variant?._id : null,
          qty: row.qty,
          costPrice: Number(row.costPrice),
          imeis: row.imeis || []
        }))
      });

      setItems([
        {
          id: Date.now(),
          product: null,
          variant: null,
          qty: 1,
          costPrice: "",
          imeis: []
        }
      ]);
      setInvoiceNo("");
      setShowDrawer(false);

      alert("✅ Purchase saved successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "❌ Purchase failed");
    }
  };

  /* ========= UI ========= */
  return (
    <div style={{ padding: 20 }}>
      <h2>🧾 Purchase Entry</h2>

      {/* SUPPLIER */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <select value={supplierId} onChange={e => setSupplierId(e.target.value)}>
          <option value="">Select Supplier</option>
{suppliers.map(s => (
  <option key={s._id} value={s._id}>
    {s.name}
  </option>
))}

        </select>

        <input
          placeholder="New Supplier"
          value={newSupplier}
          onChange={e => setNewSupplier(e.target.value)}
        />
        <button onClick={addSupplier}>Add</button>
      </div>

      {/* INVOICE */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Invoice No"
          value={invoiceNo}
          onChange={e => setInvoiceNo(e.target.value)}
        />
        <input value={date} readOnly />
      </div>

      {/* TABLE */}
      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Variant</th>
            <th>Qty</th>
            <th>Cost</th>
            <th>IMEI / Serial</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {items.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>

              <td>
                {row.product ? (
                  <>
                    <b>{row.product.name}</b>
                    <div style={{ fontSize: 12 }}>
                      {row.product.trackingType}
                    </div>
                    <button
                      style={{ fontSize: 11 }}
                      onClick={() => {
                        const copy = [...items];
                        copy[index] = {
                          ...copy[index],
                          product: null,
                          variant: null,
                          imeis: [],
                          qty: 1
                        };
                        setItems(copy);
                      }}
                    >
                      Change
                    </button>
                  </>
                ) : (
                  <PurchaseProductSelector
onSelect={async ({ product }) => {
  const copy = [...items];
  copy[index].product = product;
  copy[index].variant = null;
  copy[index].imeis = [];
  copy[index].qty = 1;
  copy[index]._variants = []; // 👈 reset
  setItems(copy);

  // 🔥 LOAD VARIANTS FROM BACKEND
  if (product.allowVariants) {
    try {
      const res = await listVariants(product.id);

      setItems(prev => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          _variants: res || []
        };
        return updated;
      });
    } catch (err) {
      console.error("Variant load failed", err);
    }
  }
}}

                  />
                )}
              </td>

<td>
  {row.product?.allowVariants ? (
    <select
      value={row.variant?._id || ""}
      onChange={e => {
        const v = row._variants?.find(
          x => String(x._id) === e.target.value
        );

        const copy = [...items];
        copy[index].variant = v || null;
        copy[index].imeis = [];
        setItems(copy);
      }}
    >
      <option value="">Select</option>

      {(row._variants || []).map(v => (
        <option key={v._id} value={v._id}>
          {Object.values(v.attributes || {}).join(" / ")}
        </option>
      ))}
    </select>
  ) : "-"}
</td>


              <td>
                <input
                  type="number"
                  min={1}
                  disabled={row.product?.trackingType !== "QTY"}
                  value={row.qty}
                  onChange={e => {
                    const copy = [...items];
                    copy[index].qty = Number(e.target.value);
                    setItems(copy);
                  }}
                  style={{ width: 60 }}
                />
              </td>

              <td>
                <input
                  type="number"
                  value={row.costPrice}
                  onChange={e => {
                    const copy = [...items];
                    copy[index].costPrice = e.target.value;
                    setItems(copy);
                  }}
                  style={{ width: 80 }}
                />
              </td>

              <td style={{ textAlign: "center" }}>
                {row.product?.trackingType !== "QTY" ? (
                  <button
                    onClick={() => {
                      setActiveRowIndex(index);
                      setShowDrawer(true);
                    }}
                  >
                    Enter
                  </button>
                ) : "-"}
              </td>

              <td>
                {row.qty && row.costPrice ? row.qty * row.costPrice : "-"}
              </td>

              <td>
                <button
                  onClick={() =>
                    setItems(items.filter((_, i) => i !== index))
                  }
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{ marginTop: 10 }}
        onClick={() =>
          setItems(prev => [
            ...prev,
            {
              id: Date.now(),
              product: null,
              variant: null,
              qty: 1,
              costPrice: "",
              imeis: []
            }
          ])
        }
      >
        ➕ Add Item
      </button>

      <br /><br />
      <button onClick={savePurchase}>💾 Save Purchase</button>

      {showDrawer && activeRowIndex !== null && (
        <div style={drawerStyle}>
          <h3>Enter {items[activeRowIndex]?.product?.trackingType}</h3>

          {Array.from({
            length: (items[activeRowIndex]?.imeis?.length || 0) + 1
          }).map((_, i) => (
            <input
              key={i}
              value={items[activeRowIndex]?.imeis[i] || ""}
              onChange={e => {
                const copy = [...items];
                const arr = copy[activeRowIndex].imeis || [];
                arr[i] = e.target.value.trim();
                copy[activeRowIndex].imeis = arr.filter(Boolean);
                copy[activeRowIndex].qty =
                  copy[activeRowIndex].imeis.length;
                setItems(copy);
              }}
            />
          ))}

          <button onClick={() => setShowDrawer(false)}>Done</button>
        </div>
      )}
    </div>
  );
}

const drawerStyle = {
  position: "fixed",
  right: 0,
  top: 0,
  width: 360,
  height: "100%",
  background: "#fff",
  padding: 20,
  boxShadow: "-4px 0 10px rgba(0,0,0,.3)"
};
