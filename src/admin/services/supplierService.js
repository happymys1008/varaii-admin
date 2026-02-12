import api from "../../core/api/api";

/* =========================
   📦 GET SUPPLIERS
========================= */
export const listSuppliers = async () => {
  const res = await api.get("/suppliers");
  return Array.isArray(res.data) ? res.data : [];
};

/* =========================
   ➕ CREATE SUPPLIER
========================= */
export const createSupplier = async (name) => {
  if (!name || !name.trim()) {
    throw new Error("Supplier name required");
  }

  const res = await api.post("/suppliers", {
    name: name.trim()
  });

  return res.data;
};
