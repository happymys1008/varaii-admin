import { useState, useMemo, useEffect } from "react";
import api from "../../../core/api/api";
import { slugify } from "../../../utils/product/slugify";

export default function CreateProductModal({
  categories = [],
  subCategories = [],
  childCategories = [],
  brands = [],
  onClose,
  onSave
}) {
const [form, setForm] = useState({
  name: "",
  categoryId: "",
  subCategoryId: "",
  childCategoryId: "",
  brandId: "",
  trackingType: "QTY",
  hasVariants: false,
  variantConfig: []
});


const [attributeOptions, setAttributeOptions] = useState([]);


  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

useEffect(() => {
  const loadAttributes = async () => {
    try {
      const res = await api.get("/product-attributes");
      const list = res.data || [];

      // sirf key chahiye, uppercase me
      const keys = list.map(attr => attr.key.toUpperCase());

      setAttributeOptions(keys);
    } catch (err) {
      console.error("Failed loading attributes", err);
    }
  };

  loadAttributes();
}, []);

  const filteredSubCategories = useMemo(() => {
    if (!form.categoryId) return [];
    return subCategories.filter(
      sc => String(sc.categoryId) === String(form.categoryId)
    );
  }, [form.categoryId, subCategories]);

  const filteredChildCategories = useMemo(() => {
    if (!form.subCategoryId) return [];
    return childCategories.filter(
      cc => String(cc.subCategoryId) === String(form.subCategoryId)
    );
  }, [form.subCategoryId, childCategories]);

  const filteredBrands = useMemo(() => brands || [], [brands]);

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Product name is required");
    if (!form.categoryId) return alert("Category is required");
    if (!form.childCategoryId) return alert("Product type is required");

const payload = {
  name: form.name.trim(),
  slug: slugify(form.name.trim()) + "-" + Date.now(),
  categoryId: form.categoryId,
  subCategoryId: form.subCategoryId,
  childCategoryId: form.childCategoryId,
  brandId: form.brandId || null,
  trackingType: form.trackingType,
  hasVariants: form.hasVariants,
  variantConfig: form.hasVariants ? form.variantConfig : []
};

    try {
      const success = await onSave(payload);
      if (success) onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create product");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ marginBottom: 10 }}>✨ Create Product</h3>

        <input
          style={input}
          placeholder="Product name"
          value={form.name}
          onChange={e => update("name", e.target.value)}
        />

        <select style={input} value={form.categoryId}
          onChange={e => {
            update("categoryId", e.target.value);
            update("subCategoryId", "");
            update("childCategoryId", "");
            update("brandId", "");
          }}>
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select style={input}
          value={form.subCategoryId}
          onChange={e => update("subCategoryId", e.target.value)}
          disabled={!form.categoryId}>
          <option value="">Select Sub Category</option>
          {filteredSubCategories.map(sc => (
            <option key={sc._id} value={sc._id}>{sc.name}</option>
          ))}
        </select>

        <select style={input}
          value={form.childCategoryId}
          onChange={e => update("childCategoryId", e.target.value)}
          disabled={!form.subCategoryId}>
          <option value="">Select Product Type</option>
          {filteredChildCategories.map(cc => (
            <option key={cc._id} value={cc._id}>{cc.name}</option>
          ))}
        </select>

        <select style={input}
          value={form.brandId}
          onChange={e => update("brandId", e.target.value)}>
          <option value="">Select Brand</option>
          {filteredBrands.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>

        <select style={input}
          value={form.trackingType}
          onChange={e => update("trackingType", e.target.value)}>
          <option value="QTY">Quantity Based</option>
          <option value="SERIAL">Serial Based</option>
          <option value="IMEI">IMEI Based</option>
        </select>

        {/* 🔥 Highlighted Variant Box */}
<div style={variantBox}>
  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <input
      type="checkbox"
      checked={form.hasVariants}
      onChange={e => {
        update("hasVariants", e.target.checked);
        if (!e.target.checked) {
          update("variantConfig", []);
        }
      }}
    />
    <b>This product has variants</b>
  </label>

  {form.hasVariants && (
    <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
      {attributeOptions.map(type => (
        <label key={type} style={{ display: "flex", gap: 8 }}>
          <input
            type="checkbox"
            checked={form.variantConfig.includes(type)}
            onChange={e => {
              if (e.target.checked) {
                update("variantConfig", [...form.variantConfig, type]);
              } else {
                update(
                  "variantConfig",
                  form.variantConfig.filter(v => v !== type)
                );
              }
            }}
          />
          {type}
        </label>
      ))}
    </div>
  )}
</div>

        <div style={buttonRow}>
          <button style={cancelBtn} onClick={onClose}>Cancel</button>
          <button style={saveBtn} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)", // dark overlay only
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999
};

const modal = {
  background: "#ffffff",
  padding: 28,
  borderRadius: 14,
  width: 460,
  display: "grid",
  gap: 14,
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  border: "1px solid rgba(37,99,235,0.2)"
};

const input = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none"
};

const variantBox = {
  padding: 12,
  borderRadius: 8,
  background: "linear-gradient(135deg,#eef2ff,#e0f2fe)",
  border: "1px solid #c7d2fe",
  fontSize: 14
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 10
};

const saveBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 500
};

const cancelBtn = {
  background: "#f3f4f6",
  border: "none",
  padding: "8px 18px",
  borderRadius: 8,
  cursor: "pointer"
};