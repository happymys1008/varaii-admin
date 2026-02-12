import { useEffect, useState, useMemo } from "react";

export default function ProductBasicInfo({
  product,
  categories = [],
  subCategories = [],
  childCategories = [],
  brands = [],
  onSave
}) {
  /* ================= MODE ================= */
  const isEdit = Boolean(product?._id);

  /* ================= STATE ================= */
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


/* ================= DEFAULT VARIANT ================= */
const defaultVariant = useMemo(() => {
  if (!product?.variants?.length) return null;
  return (
    product.variants.find(v => v.isDefault) ||
    product.variants[0] ||
    null
  );
}, [product]);


  /* ================= LOAD EDIT DATA ================= */
useEffect(() => {
  if (!product) return;

  const isVariantProduct = Boolean(product.allowVariants);

  setForm({
    name: product.name || "",
    categoryId: product.categoryId ? String(product.categoryId) : "",
    subCategoryId: product.subCategoryId
      ? String(product.subCategoryId)
      : "",
    childCategoryId: product.childCategoryId
      ? String(product.childCategoryId)
      : "",
    brandId: product.brandId ? String(product.brandId) : "",
    trackingType: product.trackingType || "QTY",
    allowVariants: Boolean(product.allowVariants),

    // 🔥 FINAL PRICE LOGIC
    mrp: isVariantProduct
      ? defaultVariant?.mrp ?? ""
      : product.mrp ?? "",

    sellingPrice: isVariantProduct
      ? defaultVariant?.sellingPrice ?? ""
      : product.sellingPrice ?? ""
  });
}, [product, defaultVariant]);



  /* ================= UPDATE ================= */
  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    if (!form.name.trim()) return alert("Product name is required");
    if (!form.categoryId) return alert("Category is required");
    if (!form.childCategoryId) return alert("Product type is required");

    if (!form.allowVariants) {
      if (!form.mrp || !form.sellingPrice)
        return alert("MRP & Selling Price required");
      if (+form.sellingPrice > +form.mrp)
        return alert("Selling Price cannot exceed MRP");
    }

const payload = {
  name: form.name.trim(),
  categoryId: form.categoryId,
  subCategoryId: form.subCategoryId,
  childCategoryId: form.childCategoryId,
  brandId: form.brandId
};

// 🔒 EDIT CASE
if (isEdit && product?._id) {
  payload._id = product._id;
}


// 🔥 NON-VARIANT PRODUCT → price goes to PRODUCT
if (!form.allowVariants) {
  onSave({
    product: {
      ...payload,
      mrp: Number(form.mrp),
      sellingPrice: Number(form.sellingPrice)
    },
    variantPrice: null
  });
  return;
}

// 🔥 VARIANT PRODUCT → price goes to VARIANT
onSave({
  product: payload,
  variantPrice: {
    variantId: defaultVariant._id,
    mrp: Number(form.mrp),
    sellingPrice: Number(form.sellingPrice)
  }
});



  };

  /* ================= UI ================= */
  return (
    <div style={card}>
      <h3>Basic Product Information</h3>

      <input
        placeholder="Product name"
        value={form.name}
        onChange={e => update("name", e.target.value)}
      />

      {/* CATEGORY */}
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

      {/* SUB CATEGORY */}
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
          .filter(sc => String(sc.categoryId) === String(form.categoryId))
          .map(sc => (
            <option key={sc._id} value={sc._id}>
              {sc.name}
            </option>
          ))}
      </select>

      {/* PRODUCT TYPE */}
      <select
        value={form.childCategoryId}
        disabled={!form.subCategoryId}
        onChange={e => update("childCategoryId", e.target.value)}
      >
        <option value="">Select Product Type</option>
        {childCategories
          .filter(
            cc =>
              String(cc.subCategoryId) === String(form.subCategoryId)
          )
          .map(cc => (
            <option key={cc._id} value={cc._id}>
              {cc.name}
            </option>
          ))}
      </select>

      {/* BRAND */}
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

      {/* CREATE ONLY */}
      {!isEdit && (
        <>
          <select
            value={form.trackingType}
            onChange={e => update("trackingType", e.target.value)}
          >
            <option value="QTY">Quantity Based</option>
            <option value="SERIAL">Serial Based</option>
            <option value="IMEI">IMEI Based</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={form.allowVariants}
              onChange={e =>
                update("allowVariants", e.target.checked)
              }
            />{" "}
            Enable Variants
          </label>
        </>
      )}

      {/* PRICE */}
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



/* ================= STYLES ================= */

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
