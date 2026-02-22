import { useEffect, useState, useMemo } from "react";
import api from "../../../core/api/api";

export default function AddSkuModal({
  product,
  productId,
  colorId,
  existingSkus = [],
  onClose,
  onSave
})

 {
const variantConfig = useMemo(() => {
  return product?.variantConfig || [];
}, [product?.variantConfig]);

const hasColor = variantConfig.includes("COLOR");


const [attributeOptions, setAttributeOptions] = useState({});
const [selectedAttributes, setSelectedAttributes] = useState({});


  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const [error, setError] = useState("");

  /* ================= LOAD MASTER ATTRIBUTES ================= */
useEffect(() => {
  const loadMaster = async () => {
    try {
      const res = await api.get("/product-attributes");
      const list = res.data || [];

      const optionsMap = {};

      for (const attr of list) {
        const keyUpper = attr.key.toUpperCase();

        if (variantConfig.includes(keyUpper)) {
          optionsMap[keyUpper] = attr.values || [];
        }
      }

      setAttributeOptions(optionsMap);

    } catch (err) {
      console.error("Failed loading SKU master", err);
    }
  };

  loadMaster();
}, [variantConfig]);

  /* ================= SAVE ================= */
const handleSave = () => {
  setError("");

  if (!mrp || !sellingPrice) {
    setError("MRP & Selling Price required");
    return;
  }

  if (Number(sellingPrice) > Number(mrp)) {
    setError("Selling price cannot be greater than MRP");
    return;
  }

  // 🔒 Required validation
  for (const key of Object.keys(attributeOptions)) {
    if (!selectedAttributes[key]) {
      setError(`${key} required`);
      return;
    }
  }

  // 🔒 Duplicate check (NEW CORRECT LOGIC)
  const duplicate = existingSkus.some((sku) => {
    return Object.keys(attributeOptions).every((key) => {
      const lowerKey = key.toLowerCase();
      return (
        sku.attributes?.[lowerKey] === selectedAttributes[key]
      );
    });
  });

  if (duplicate) {
    setError("This SKU combination already exists");
    return;
  }

  // ✅ Build payload properly
  const payload = {
    productId,
    colorId: hasColor ? colorId : null,
    mrp: Number(mrp),
    sellingPrice: Number(sellingPrice),
    attributes: {}
  };

  // 🔥 add attributes properly
  for (const key of Object.keys(attributeOptions)) {
    payload.attributes[key.toLowerCase()] =
      selectedAttributes[key];
  }

  onSave(payload);
};


  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3>Add SKU</h3>

{Object.keys(attributeOptions).map(attrKey => (
  <div key={attrKey} style={{ marginBottom: 12 }}>
    <label>{attrKey}</label>

    <select
      value={selectedAttributes[attrKey] || ""}
      onChange={(e) =>
        setSelectedAttributes(prev => ({
          ...prev,
          [attrKey]: e.target.value
        }))
      }
      style={inputStyle}
    >
      <option value="">Select {attrKey}</option>

      {attributeOptions[attrKey].map(val => (
        <option key={val} value={val}>
          {val}
        </option>
      ))}

    </select>
  </div>
))}

        {/* PRICE */}
        <div style={{ marginBottom: 12 }}>
          <label>MRP</label>
          <input
            type="number"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Selling Price</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{ color: "red", fontSize: 13 }}>{error}</div>
        )}

        <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} style={primaryBtn}>
            Save SKU
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
  width: 400
};

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 5,
  borderRadius: 6,
  border: "1px solid #ccc"
};

const primaryBtn = {
  background: "#0b5ed7",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer"
};