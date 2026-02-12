const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL_PROD
    : process.env.REACT_APP_API_BASE_URL;

/* =========================
   🔒 SAFE RESPONSE PARSER
========================= */

const parseOrders = async res => {
  let data = [];
  try {
    data = await res.json();
  } catch {
    data = [];
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;

  return [];
};

/* =========================
   📦 LIST ORDERS
========================= */

export const listOrders = async (status, { signal } = {}) => {
  const url = status
    ? `${API_BASE}/api/orders?status=${status}`
    : `${API_BASE}/api/orders`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error("Failed loading orders");
  }

  return parseOrders(res);
};

/* =========================
   👤 CUSTOMER ORDERS
========================= */

export const listOrdersByCustomer = async (customerId, { signal } = {}) => {
  const res = await fetch(
    `${API_BASE}/api/orders?customerId=${customerId}`,
    { signal }
  );

  if (!res.ok) {
    throw new Error("Failed loading customer orders");
  }

  return parseOrders(res);
};

/* =========================
   🔄 UPDATE STATUS
========================= */

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(
    `${API_BASE}/api/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }
  );

  let data = {};
  try {
    data = await res.json();
  } catch {}

if (!res.ok) {
  const text = await res.text();
  console.error("Order API failed:", text);
  throw new Error("Failed loading orders");
}


  return data;
};
