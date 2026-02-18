import api from "../../core/api/api";

/* ==============================
   📦 ADMIN VARIANT READ
============================== */

export const listVariants = async (productId) => {
  if (!productId) return [];

  try {
    const res = await api.get(
      `/products/${productId}/variants`
    );

    return Array.isArray(res?.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Variant list failed", err);
    return [];
  }
};


/* ==============================
   ➕ CREATE VARIANT
============================== */

export const createVariant = async (productId, payload) => {
  if (!productId) {
    throw new Error("Product ID missing for variant create");
  }

  try {
    const res = await api.post(
      `/products/${productId}/variants`,
      payload
    );

    return res.data;
  } catch (err) {
    console.error("❌ Variant create failed", err);
    throw err;
  }
};


/* ==============================
   ✏️ UPDATE VARIANT (PRICE + IMAGES + ATTRIBUTES)
============================== */

export const updateVariant = async (variantId, payload) => {
  if (!variantId) {
    throw new Error("Variant ID missing for update");
  }

  try {
    const res = await api.put(
      `/products/variants/${variantId}`,
      payload
    );

    return res.data;
  } catch (err) {
    console.error("❌ Variant update failed", err);
    throw err;
  }
};

