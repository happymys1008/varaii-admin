import { useEffect, useState } from "react";
import api from "../../../core/api/api";

export default function EditVariantModal({
  variant,
  existingVariants = [],
  onClose,
  onSave
}) {
  /* ================= STATE ================= */
  const [attributesMaster, setAttributesMaster] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [error, setError] = useState("");

  const [mrp, setMrp] = useState(variant.mrp || "");
  const [sellingPrice, setSellingPrice] = useState(
    variant.sellingPrice || ""
  );

  const [variantImages, setVariantImages] = useState(
    Array.isArray(variant.images) ? variant.images : []
  );

  const [imageInput, setImageInput] = useState("");

  const [hasInventory, setHasInventory] = useState(false);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* ================= LOAD ATTRIBUTES + INVENTORY ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔥 ATTRIBUTES FROM DB
        const attrRes = await api.get("/api/product-attributes");
        const attrs = attrRes.data || [];

        setAttributesMaster(attrs);
        setAttributes({ ...variant.attributes });

        // 🔥 INVENTORY CHECK FROM DB
        const invRes = await api.get("/api/inventory");
        const inventory = invRes.data || [];

        const used = inventory.some(
          inv =>
            String(inv.variantId) === String(variant._id) &&
            (inv.qty > 0 ||
              (Array.isArray(inv.imeis) && inv.imeis.length > 0))
        );

        setHasInventory(used);
      } catch (err) {
        console.error(err);
        setError("Failed to load variant data");
      }
    };

    loadData();
  }, [variant]);

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

    // 🔒 duplicate guard (ignore self)
    const signature = JSON.stringify(attributes);
    const exists = existingVariants.some(
      v =>
        v._id !== variant._id &&
        JSON.stringify(v.attributes) === signature
    );

    if (exists) {
      setError("Another variant with same attributes exists");
      return;
    }

    const updatedVariant = {
      ...variant,
      attributes,
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      images: variantImages
    };

    onSave(updatedVariant);
  };

  /* ================= IMAGE URL ADD ================= */
  const handleAddVariantImage = (e) => {
    if (e.key === "Enter") {
      const url = imageInput.trim();
      if (!url) return;

      setVariantImages(prev => [...prev, url]);
      setImageInput("");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <h3>Edit Variant</h3>

        {/* ATTRIBUTES */}
        {attributesMaster.map(attr => (
          <div key={attr.key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13 }}>{attr.name}</label>

            <select
              disabled={hasInventory}
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

        {hasInventory && (
          <div style={{ color: "#b45309", fontSize: 13, marginBottom: 10 }}>
            ⚠ Inventory exists. Attributes locked.
          </div>
        )}

        {/* PRICE */}
        <div style={{ marginBottom: 12 }}>
          <label>MRP</label>
          <input
            type="number"
            value={mrp}
            onChange={e => setMrp(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Selling Price</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={e => setSellingPrice(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* IMAGES (URL ONLY) */}
        <div style={{ marginBottom: 14 }}>
          <label>Variant Images (URL)</label>
          <input
            value={imageInput}
            onChange={e => setImageInput(e.target.value)}
            onKeyDown={handleAddVariantImage}
            style={inputStyle}
          />
        </div>

        {error && <div style={{ color: "red", fontSize: 13 }}>{error}</div>}

        <div style={actionRow}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} style={primaryBtn}>
            Update Variant
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
  borderRadius: 6
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
