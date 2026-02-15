import api from "../../core/api/api";

/* ===============================
   CREATE PURCHASE (ADMIN)
=============================== */

export const createPurchaseApi = async (payload) => {
  const res = await api.post(
    "/purchases",
    payload
  );

  return res.data;
};
