const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL_PROD
    : process.env.REACT_APP_API_BASE_URL;

/* ======================================
   🚨 LOW STOCK (ADMIN DASHBOARD READ)
====================================== */

export const listLowStockInventory = async ({ signal } = {}) => {
  const res = await fetch(
    `${API_BASE}/api/inventory/low-stock`,
    { signal }
  );

  let data = [];
  try {
    data = await res.json();
  } catch {
    data = [];
  }

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed loading low stock inventory"
    );
  }

  // ✅ Works with both array & paginated API
  return Array.isArray(data) ? data : data?.items || [];
};
