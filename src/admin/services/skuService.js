import api from "../../core/api/api";

/* ================= SKU ================= */

// Get SKUs by color
export const listSkusByColor = async (colorId) => {
  const res = await api.get(`/skus/colors/${colorId}/skus`);
  return res.data;
};

// Create SKU
export const createSku = async (
  productId,
  colorId,
  payload
) => {
  const res = await api.post(
    `/skus/${productId}/colors/${colorId}/skus`,
    payload
  );
  return res.data;
};

// Delete SKU
export const deleteSku = async (skuId) => {
  const res = await api.delete(`/skus/${skuId}`);
  return res.data;
};
