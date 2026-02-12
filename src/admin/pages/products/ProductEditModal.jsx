import { useEffect, useState, useMemo } from "react";


export default function ProductEditModal({
  product,
  categories = [],
  subCategories = [],
  childCategories = [],
  brands = [],
  onClose,
  onSave
}) {
  const [form, setForm] = useState(product || {});

useEffect(() => {
  if (!product) return;

  // STEP 1: base fields
  setForm(prev => ({
    ...prev,
    ...product,
    categoryId: String(product.categoryId || ""),
    brandId: String(product.brandId || "")
  }));
}, [product]);

useEffect(() => {
  if (!product) return;

  // STEP 2: dependent fields (AFTER category)
  setForm(prev => ({
    ...prev,
    subCategoryId: String(product.subCategoryId || "")
  }));
}, [product]);

useEffect(() => {
  if (!product) return;

  // STEP 3: child category (AFTER sub category)
  setForm(prev => ({
    ...prev,
    childCategoryId: String(product.childCategoryId || "")
  }));
}, [product]);



  const isEdit = Boolean(form?.id);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /* ================= SAVE GUARD ================= */
  const handleSave = () => {
    /* BASIC VALIDATIONS */
    if (!form.name || !form.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!form.categoryId) {
      alert("Category is required");
      return;
    }
if (!form.childCategoryId) {
  alert("Product Type is required");
  return;
}


    if (!isEdit && !form.trackingType) {
      alert("Tracking type is required");
      return;
    }

    /* DUPLICATE GUARD */
    const nameKey = form.name.trim().toLowerCase();
    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    const duplicate = products.find(p =>
      p.id !== form.id &&
      p.name?.toLowerCase() === nameKey &&
      String(p.categoryId) === String(form.categoryId)
    );

    if (duplicate) {
      alert("❌ Product already exists with same name & category");
      return;
    }

/* PRICE VALIDATION (NON-VARIANT PRODUCT) */
if (!form.allowVariants) {
  if (!form.mrp || !form.sellingPrice) {
    alert("MRP & Selling Price are required");
    return;
  }

  if (Number(form.sellingPrice) > Number(form.mrp)) {
    alert("Selling Price cannot be greater than MRP");
    return;
  }
}


onSave({
  ...form,
  name: form.name.trim(),

  categoryId: Number(form.categoryId),
  subCategoryId: Number(form.subCategoryId),
  childCategoryId: Number(form.childCategoryId), // ⭐ MUST

  mrp: form.allowVariants ? null : Number(form.mrp),
  sellingPrice: form.allowVariants
    ? null
    : Number(form.sellingPrice)
});

  };

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


  /* ================= UI ================= */
  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>{isEdit ? "Edit Product" : "Create Product"}</h3>

        {/* PRODUCT NAME */}
        <input
          value={form.name || ""}
          onChange={e => update("name", e.target.value)}
          placeholder="Product name (eg: Samsung A25 5G)"
        />

{/* PRICE — ONLY WHEN VARIANTS OFF */}
{!form.allowVariants && (
  <>
    <input
      type="number"
      placeholder="MRP"
      value={form.mrp || ""}
      onChange={e => update("mrp", e.target.value)}
    />

    <input
      type="number"
      placeholder="Selling Price"
      value={form.sellingPrice || ""}
      onChange={e => update("sellingPrice", e.target.value)}
    />
  </>
)}


        {/* CATEGORY */}
        <select
          value={form.categoryId || ""}
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

          ))}
        </select>

{/* SUB CATEGORY */}
<select
  value={form.subCategoryId || ""}
  onChange={e => {
    update("subCategoryId", e.target.value);
    update("childCategoryId", "");
  }}
  disabled={!form.categoryId}
>
  <option value="">Select Sub-Category</option>

  {filteredSubCategories.map(sc => (
    <option key={sc.id} value={sc.id}>
      {sc.name}
    </option>
  ))}
</select>



{/* PRODUCT TYPE */}
<select
  value={form.childCategoryId || ""}
  onChange={e => update("childCategoryId", e.target.value)}
  disabled={!form.subCategoryId}
>
  <option value="">Select Product Type</option>

  {filteredChildCategories.map(cc => (
    <option key={cc.id} value={cc.id}>
      {cc.name}
    </option>
  ))}
</select>




{/* BRAND */}
<select
  value={form.brandId || ""}
  onChange={e => update("brandId", e.target.value)}
>
  <option value="">Select Brand</option>
  {brands.map(b => (
    <option key={b.id} value={b.id}>
      {b.name}
    </option>
  ))}
</select>


        {/* CREATE ONLY CONTROLS */}
        {!isEdit ? (
          <>
            {/* TRACKING TYPE */}
            <select
              value={form.trackingType || "QTY"}
              onChange={e =>
                update("trackingType", e.target.value)
              }
            >
              <option value="QTY">Quantity Based</option>
              <option value="SERIAL">Serial Based</option>
              <option value="IMEI">IMEI Based</option>
            </select>

            {/* VARIANTS */}
            <label style={{ fontSize: 14 }}>
              <input
                type="checkbox"
                checked={!!form.allowVariants}
                onChange={e => {
                  update("allowVariants", e.target.checked);
                  if (e.target.checked) {
  update("mrp", "");
  update("sellingPrice", "");
}
                }}
              />{" "}
              Enable Variants
            </label>

            {form.allowVariants && (
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginLeft: 22
                }}
              >
                💡 Price will be managed per variant
              </div>
            )}
          </>
        ) : (
          /* EDIT MODE LOCK */
          <div style={lockBox}>
            <div>
              <b>Tracking Type:</b>{" "}
              {form.trackingType === "IMEI" && "IMEI Based"}
              {form.trackingType === "SERIAL" && "Serial Based"}
              {form.trackingType === "QTY" && "Quantity Based"}
            </div>

            <div>
              <b>Variants Enabled:</b>{" "}
              {form.allowVariants ? "Yes" : "No"}
            </div>

            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
              🔒 Tracking & variants are locked after creation
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave} style={saveBtn}>
            Save
          </button>

          <button onClick={onClose} style={cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  width: 420,
  display: "grid",
  gap: 10
};

const lockBox = {
  padding: 10,
  background: "#f8f9fa",
  borderRadius: 6,
  border: "1px solid #dee2e6",
  fontSize: 14
};

const saveBtn = {
  background: "#198754",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer"
};

const cancelBtn = {
  marginLeft: 10,
  background: "#e5e7eb",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer"
};
