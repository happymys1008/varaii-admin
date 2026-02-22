import api from "../../core/api/api";

/* ==============================
   📦 ADMIN PRODUCT READ
============================== */

export const listProducts = async (
  { page = 1, limit = 200 } = {},
  { signal } = {}
) => {
  const res = await api.get("/products", {
    params: { page, limit },
    signal
  });

  const data = res?.data || [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

/* ==============================
   ➕ ADMIN PRODUCT CREATE
============================== */

export const createProduct = async (product) => {
  try {
    const payload = { ...product };

    // 🔒 CREATE RULE (UNCHANGED)
    if (payload.hasVariants === true) {
      delete payload.mrp;
      delete payload.sellingPrice;
    } else {
      if (payload.mrp == null || payload.sellingPrice == null) {
        throw new Error("MRP & Selling Price required");
      }

      payload.mrp = Number(payload.mrp);
      payload.sellingPrice = Number(payload.sellingPrice);
    }

    const res = await api.post("/products", payload);
    return res.data;
  } catch (err) {
    console.error(
      "❌ Create product failed:",
      err?.response?.data || err
    );
    throw err;
  }
};

/* ==============================
   ✏️ ADMIN PRODUCT UPDATE
============================== */

export const updateProduct = async (product) => {
  try {
    if (!product?._id) {
      throw new Error("Product ID missing for update");
    }

    const payload = { ...product };

    // ✅ VARIANT PRODUCT → PRICE NOT IN PRODUCT
    if (payload.hasVariants === true) {
      delete payload.mrp;
      delete payload.sellingPrice;
    }

    // ✅ NON-VARIANT PRODUCT → PRICE SAVED IN PRODUCT
    if (payload.hasVariants === false) {
      payload.mrp = Number(payload.mrp);
      payload.sellingPrice = Number(payload.sellingPrice);
    }

    const res = await api.put(
      `/products/${product._id}`,
      payload
    );

    return res.data;
  } catch (err) {
    console.error(
      "❌ Update product failed:",
      err?.response?.data || err
    );
    throw err;
  }
};


/* ==============================
   📦 ADMIN PRODUCT READ (BY ID)
============================== */

export const getProductById = async (productId) => {
  if (!productId) return null;

  const res = await api.get(`/products/${productId}`);
  return res?.data || null;
};
