const API_BASE = process.env.REACT_APP_API_BASE_URL;

/* ===============================
   ADMIN CUSTOMER SERVICE
   =============================== */

export const customerService = {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  getCustomerAddresses
};

/* 🔹 GET ALL CUSTOMERS (ADMIN) */
async function getAllCustomers() {
  const res = await fetch(
    `${API_BASE}/api/users/admin/customers`,
    {
      credentials: "include"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load customers");
  }

  return res.json();
}

/* 🔹 GET SINGLE CUSTOMER (ADMIN) */
async function getCustomerById(customerId) {
  const res = await fetch(
    `${API_BASE}/api/users/admin/customers/${customerId}`,
    {
      credentials: "include"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load customer");
  }

  return res.json();
}

/* 🔹 UPDATE CUSTOMER (ADMIN) */
async function updateCustomer(customerId, payload) {
  const res = await fetch(
    `${API_BASE}/api/users/admin/customers/${customerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    }
  );

  if (!res.ok) {
    throw new Error("Customer update failed");
  }

  return res.json();
}


/* 🔹 GET CUSTOMER ADDRESSES (ADMIN) */
async function getCustomerAddresses(customerId) {
  const res = await fetch(
    `${API_BASE}/api/users/admin/customers/${customerId}/addresses`,
    {
      credentials: "include"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load customer addresses");
  }

  return res.json();
}

