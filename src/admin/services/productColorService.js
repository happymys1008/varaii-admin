import api from "../../core/api/api";

/* ================= COLORS ================= */

// Get all colors of product
export const listColors = async (productId) => {
  const res = await api.get(`/product-colors/${productId}/colors`);
  return res.data;
};

// Create color
export const createColor = async (productId, payload) => {
  const res = await api.post(
    `/product-colors/${productId}/colors`,
    payload
  );
  return res.data;
};

// Delete color
export const deleteColor = async (colorId) => {
  const res = await api.delete(
    `/product-colors/colors/${colorId}`
  );
  return res.data;
};
