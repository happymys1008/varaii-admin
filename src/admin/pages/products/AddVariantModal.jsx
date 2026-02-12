import { useEffect, useState } from "react";
import api from "../../../core/api/api";

export default function AddVariantModal({
  product,
  existingVariants = [],
  onClose,
  onSave
}) {
  /* ================= STATE ================= */
  const [attributesMaster, setAttributesMaster] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [error, setError] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  /* ================= LOAD ATTRIBUTES FROM DB ================= */
useEffect(() => {
  const loadAttributes = async () => {
    try {
      const res = await api.get("/product-attributes"); // ✅ FIX
      const list = res?.data || [];

      setAttributesMaster(list);

      const init = {};
      list.forEach(a => {
        init[a.key] = "";
      });
      setAttributes(init);
    } catch (err) {
      console.error(err);
      setError("Failed to load attributes");
    }
  };

  loadAttributes();
}, []);


  /* ================= CHANGE ================= */
  const updateAttr = (key, value) => {
    setAttributes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    if (Object.values(attributes).some(v => !v)) {
      setError("Please select all attributes");
      return;
    }

    if (!mrp || !sellingPrice) {
      setError("MRP & Selling Price are required");
      return;
    }

    // duplicate variant guard
    const signature = JSON.stringify(attributes);
    const exists = existingVariants.some(
      v => JSON.stringify(v.attributes) === signature
    );

    if (exists) {
      setError("This variant already exists");
      return;
    }

    const newVariant = {
      attributes,
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice)
    };

    onSave(newVariant);
  };

  /* ================= UI ================= */
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <h3>Add Variant</h3>

<p style={{ fontSize: 13, opacity: 0.7 }}>
  Product: <b>{product?.name || "Selected Product"}</b>
</p>


        {/* ATTRIBUTES */}
        {attributesMaster.map(attr => (
          <div key={attr.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13 }}>{attr.name}</label>

            <select
              value={attributes[attr.key] || ""}
              onChange={e => updateAttr(attr.key, e.target.value)}
              style={inputStyle}
            >
              <option value="">Select {attr.name}</option>
              {attr.values.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}

        {/* PRICE */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>MRP</label>
          <input
            type="number"
            value={mrp}
            onChange={e => setMrp(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Selling Price</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={e => setSellingPrice(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{ color: "red", fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={actionRow}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} style={primaryBtn}>
            Save Variant
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 420,
  position: "relative"
};

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 4,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const actionRow = {
  marginTop: 16,
  display: "flex",
  justifyContent: "flex-end",
  gap: 10
};

const primaryBtn = {
  background: "#0b5ed7",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer"
};

const closeBtn = {
  position: "absolute",
  top: 10,
  right: 10,
  border: "none",
  background: "transparent",
  fontSize: 20,
  cursor: "pointer"
};
