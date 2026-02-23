import { useEffect, useState } from "react";

export default function ProductBasicInfo({
  product,
  categories = [],
  subCategories = [],
  childCategories = [],
  brands = [],
  onSave
}) {
  const isEdit = Boolean(product?._id);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    subCategoryId: "",
    childCategoryId: "",
    brandId: "",
    trackingType: "QTY",
    hasVariants: false,
    mrp: "",
    sellingPrice: ""
  });

  /* ================= LOAD EDIT DATA ================= */
  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name ?? "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
      subCategoryId: product.subCategoryId
        ? String(product.subCategoryId)
        : "",
      childCategoryId: product.childCategoryId
        ? String(product.childCategoryId)
        : "",
      brandId: product.brandId ? String(product.brandId) : "",
      trackingType: product.trackingType ?? "QTY",
      hasVariants: Boolean(product.hasVariants),

      // ✅ SKU SYSTEM → price only for non-variant
      mrp: product.hasVariants ? "" : product.mrp ?? "",
      sellingPrice: product.hasVariants
        ? ""
        : product.sellingPrice ?? ""
    });
  }, [product]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return alert("Product name is required");
    if (!form.categoryId) return alert("Category is required");
    if (!form.childCategoryId)
      return alert("Product type is required");

    const payload = {
      _id: product?._id,
      name: form.name.trim(),
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      childCategoryId: form.childCategoryId,
      brandId: form.brandId,
      hasVariants: Boolean(form.hasVariants)
    };

    // ✅ Only send price for NON-variant
    if (!form.hasVariants) {
      payload.mrp = Number(form.mrp);
      payload.sellingPrice = Number(form.sellingPrice);
    }

    onSave({ product: payload });
  };

  return (
    <div style={card}>
      <h3>Basic Product Information</h3>

      <input
        placeholder="Product name"
        value={form.name}
        onChange={e => update("name", e.target.value)}
      />

      <select
        value={form.categoryId}
        onChange={e => {
          update("categoryId", e.target.value);
          update("subCategoryId", "");
          update("childCategoryId", "");
        }}
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={form.subCategoryId}
        disabled={!form.categoryId}
        onChange={e => {
          update("subCategoryId", e.target.value);
          update("childCategoryId", "");
        }}
      >
        <option value="">Select Sub-Category</option>
        {subCategories
          .filter(
            sc =>
              String(sc.categoryId) === String(form.categoryId)
          )
          .map(sc => (
            <option key={sc._id} value={sc._id}>
              {sc.name}
            </option>
          ))}
      </select>

      <select
        value={form.childCategoryId}
        disabled={!form.subCategoryId}
        onChange={e =>
          update("childCategoryId", e.target.value)
        }
      >
        <option value="">Select Product Type</option>
        {childCategories
          .filter(
            cc =>
              String(cc.subCategoryId) ===
              String(form.subCategoryId)
          )
          .map(cc => (
            <option key={cc._id} value={cc._id}>
              {cc.name}
            </option>
          ))}
      </select>

      <select
        value={form.brandId}
        onChange={e => update("brandId", e.target.value)}
      >
        <option value="">Select Brand</option>
        {brands.map(b => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* PRICE ONLY FOR NON VARIANT */}
      {!form.hasVariants && (
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
            onChange={e =>
              update("sellingPrice", e.target.value)
            }
          />
        </>
      )}

      <button onClick={handleSave} style={saveBtn}>
        Save & Continue
      </button>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  display: "grid",
  gap: 12,
  marginBottom: 24
};

const saveBtn = {
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 6,
  cursor: "pointer",
  width: "fit-content"
};