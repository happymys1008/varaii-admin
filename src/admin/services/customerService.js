import api from "../../core/api/api";

/* ===============================
   ADMIN CUSTOMER SERVICE
=============================== */

export const customerService = {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerAddresses,
};

/* 🔹 GET ALL CUSTOMERS (ADMIN) */
async function getAllCustomers() {
  const res = await api.get("/users/admin/customers");
  return res.data;
}

/* 🔹 GET SINGLE CUSTOMER (ADMIN) */
async function getCustomerById(customerId) {
  const res = await api.get(`/users/admin/customers/${customerId}`);
  return res.data;
}

/* 🔹 UPDATE CUSTOMER (ADMIN) */
async function updateCustomer(customerId, payload) {
  const res = await api.put(
    `/users/admin/customers/${customerId}`,
    payload
  );
  return res.data;
}

/* 🔹 GET CUSTOMER ADDRESSES (ADMIN) */
async function getCustomerAddresses(customerId) {
  const res = await api.get(
    `/users/admin/customers/${customerId}/addresses`
  );
  return res.data;
}
