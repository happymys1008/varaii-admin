import { useState, useMemo } from "react";
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
    allowVariants: false,
    mrp: "",
    sellingPrice: ""
  });

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /* 🔥 CASCADING LOGIC (IMPORTANT) */
  const filteredSubCategories = useMemo(() => {
    if (!form.categoryId) return [];
    return subCategories.filter(
      sc => String(sc.categoryId) === String(form.categoryId)
    );
  }, [form.categoryId, subCategories]);

const filteredBrands = useMemo(() => {
  return brands || [];
}, [brands]);

const filteredChildCategories = useMemo(() => {
  if (!form.subCategoryId) return [];
  return childCategories.filter(
    cc => String(cc.subCategoryId) === String(form.subCategoryId)
  );
}, [form.subCategoryId, childCategories]);

 


const handleSave = async () => {
  // validations same hi rahengi 👇
  if (!form.name.trim()) return alert("Product name is required");
  if (!form.categoryId) return alert("Category is required");
  if (!form.childCategoryId) return alert("Product type is required");

  if (!form.allowVariants) {
    if (form.mrp === "" || form.sellingPrice === "") {
      return alert("MRP & Selling Price required");
    }
    if (Number(form.sellingPrice) > Number(form.mrp)) {
      return alert("Selling price cannot be greater than MRP");
    }
  }

  const payload = {
    ...form,
    name: form.name.trim(),
    slug: slugify(form.name.trim()) + "-" + Date.now(),
    mrp: form.allowVariants ? null : Number(form.mrp),
    sellingPrice: form.allowVariants ? null : Number(form.sellingPrice)
  };

  if (form.allowVariants) {
    delete payload.mrp;
    delete payload.sellingPrice;
  }

  try {
    const success = await onSave(payload);

    // ✅ ONLY close modal if product created
    if (success) {
      onClose();
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create product");
  }
};



  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Create Product</h3>

        {/* PRODUCT NAME */}
        <input
          placeholder="Product name"
          value={form.name}
          onChange={e => update("name", e.target.value)}
        />

        {/* PRICE (ONLY IF NO VARIANTS) */}
        {!form.allowVariants && (
          <>
            <input
              type="number"
              placeholder="MRP"
              value={form.mrp}
              onChange={e => update("mrp", e.target.value)}
            />

            <input
              type="number"
              placeholder="Selling Price"
              value={form.sellingPrice}
              onChange={e => update("sellingPrice", e.target.value)}
            />
          </>
        )}

        {/* CATEGORY */}
        <select
          value={form.categoryId}
          onChange={e => {
            update("categoryId", e.target.value);
            update("subCategoryId", "");
            update("childCategoryId", ""); // 🔥 reset product type
            update("brandId", "");
          }}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUB CATEGORY */}
        <select
          value={form.subCategoryId}
          onChange={e => update("subCategoryId", e.target.value)}
          disabled={!form.categoryId}
        >
          <option value="">
            {form.categoryId ? "Select Sub Category" : "Select Category First"}
          </option>

          {filteredSubCategories.map(sc => (
            <option key={sc._id} value={sc._id}>
              {sc.name}
            </option>
          ))}
        </select>


{/* PRODUCT TYPE */}
<select
  value={form.childCategoryId}
  onChange={e => update("childCategoryId", e.target.value)}
  disabled={!form.subCategoryId}
>
  <option value="">
    {form.subCategoryId
      ? "Select Product Type"
      : "Select Sub Category First"}
  </option>

  {filteredChildCategories.map(cc => (
    <option key={cc._id} value={cc._id}>
      {cc.name}
    </option>
  ))}
</select>


        {/* BRAND */}
<select
  value={form.brandId}
  onChange={e => update("brandId", e.target.value)}
  disabled={!form.categoryId}
>
  <option value="">
    {form.categoryId ? "Select Brand" : "Select Category First"}
  </option>

  {filteredBrands.map(b => (
    <option key={b._id} value={b._id}>
      {b.name}
    </option>
  ))}
</select>


        {/* TRACKING TYPE */}
        <select
          value={form.trackingType}
          onChange={e => update("trackingType", e.target.value)}
        >
          <option value="QTY">Quantity Based</option>
          <option value="SERIAL">Serial Based</option>
          <option value="IMEI">IMEI Based</option>
        </select>

        {/* VARIANTS */}
        <label style={{ fontSize: 14 }}>
          <input
            type="checkbox"
            checked={form.allowVariants}
            onChange={e => {
              update("allowVariants", e.target.checked);
              update("mrp", "");
              update("sellingPrice", "");
            }}
          />{" "}
          Enable Variants
        </label>
{form.allowVariants && (
  <small style={{ color: "#666" }}>
    Price will be managed from Variants
  </small>
)}


        {/* ACTIONS */}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={handleSave} className="btn btn-primary">
            Save
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}



/* ===== STYLES ===== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  width: 420,
  display: "grid",
  gap: 10
};
