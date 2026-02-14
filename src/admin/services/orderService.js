import api from "../../core/api/api";

/* =====================================================
   📦 LIST ORDERS (ADMIN)
===================================================== */
export const listOrders = async (status) => {
  try {
    const res = await api.get("/orders", {
      params: status ? { status } : {}
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Failed loading orders:", err?.response || err.message);
    throw new Error("Failed loading orders");
  }
};

/* =====================================================
   👤 LIST ORDERS BY CUSTOMER (ADMIN)
===================================================== */
export const listOrdersByCustomer = async (customerId) => {
  try {
    const res = await api.get("/orders", {
      params: { customerId }
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Failed loading customer orders:", err?.response || err.message);
    throw new Error("Failed loading customer orders");
  }
};

/* =====================================================
   🔄 UPDATE ORDER STATUS (ADMIN)
===================================================== */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await api.patch(`/orders/${orderId}/status`, {
      status
    });

    return res.data;
  } catch (err) {
    console.error("Order status update failed:", err?.response || err.message);
    throw new Error("Failed updating order status");
  }
};
