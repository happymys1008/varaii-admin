import api from "../../core/api/api";

/* ==============================
   📦 ADMIN VARIANT READ
============================== */

export const listVariants = async (productId) => {
  if (!productId) return [];

  // ✅ CORRECT BACKEND ROUTE
  const res = await api.get(
    `/products/${productId}/variants`
  );

  return Array.isArray(res?.data) ? res.data : [];
};


/* ==============================
   ➕ CREATE VARIANT
============================== */

export const createVariant = async (productId, payload) => {
  if (!productId) {
    throw new Error("Product ID missing for variant create");
  }

  const res = await api.post(
    `/products/${productId}/variants`,
    payload
  );

  return res.data;
};


/* ==============================
   ✏️ UPDATE VARIANT PRICE
============================== */

export const updateVariantPrice = async (variantId, payload) => {
  if (!variantId) {
    throw new Error("Variant ID missing for price update");
  }

  const res = await api.put(
    `/variants/${variantId}`,
    payload
  );

  return res.data;
};
