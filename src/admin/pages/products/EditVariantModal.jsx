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




  const [hasInventory, setHasInventory] = useState(false);


/* ================= VARIANT IMAGE UPLOAD (CLOUDINARY) ================= */
const handleVariantImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  try {
    const uploadedImages = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post(
        "/products/image/upload",   // ✅ SAME as product images (Cloudinary)
        formData
      );

      uploadedImages.push({
        imageUrl: res.data.imageUrl,
        cloudinaryPublicId: res.data.cloudinaryPublicId
      });
    }

    setVariantImages(prev => [...prev, ...uploadedImages]);

  } catch (err) {
    console.error("Variant image upload failed", err);
    setError("Image upload failed");
  }
};



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
        const attrRes = await api.get("/product-attributes");
        const attrs = attrRes.data || [];

        setAttributesMaster(attrs);
        setAttributes({ ...variant.attributes });

        // 🔥 INVENTORY CHECK FROM DB
        const invRes = await api.get("/inventory");
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

  // ✅ SEND FULL OBJECTS
  images: variantImages
};



    onSave(updatedVariant);
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

      {/* VARIANT IMAGE UPLOAD */}
      <div style={{ marginBottom: 14 }}>
        <label>Variant Images</label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleVariantImageUpload}
          style={{ marginTop: 6 }}
        />

<div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
  {variantImages.map((img, i) => (
    <div key={i} style={{ position: "relative" }}>
      
      <img
        src={img.imageUrl}
        alt="variant"
        style={{
          width: 80,
          height: 80,
          objectFit: "cover",
          borderRadius: 6
        }}
      />

      {/* 🔥 DELETE BUTTON */}
      <button
        onClick={() =>
          setVariantImages(prev =>
            prev.filter((_, index) => index !== i)
          )
        }
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 20,
          height: 20,
          cursor: "pointer",
          fontSize: 12,
          fontWeight: "bold"
        }}
      >
        ✕
      </button>

    </div>
  ))}
</div>

      </div>

      {error && (
        <div style={{ color: "red", fontSize: 13 }}>
          {error}
        </div>
      )}

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
