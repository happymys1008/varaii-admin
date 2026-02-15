import api from "../../core/api/api";

/* ======================================
   🚨 LOW STOCK (ADMIN DASHBOARD READ)
====================================== */

export const listLowStockInventory = async ({ signal } = {}) => {
  const res = await api.get("/inventory/low-stock", { signal });

  const data = res.data;

  // ✅ Works with both array & paginated API
  return Array.isArray(data) ? data : data?.items || [];
};
