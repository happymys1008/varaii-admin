import api from "../../core/api/api";

export const addressService = {

  /* ================= ADMIN: GET BY CUSTOMER ================= */
  async getByCustomer(customerId) {
    try {
      const res = await api.get(`/customers/${customerId}`);
      return res.data.addresses || [];
    } catch (err) {
      console.error("Failed to fetch customer addresses", err);
      return [];
    }
  },

  /* ================= ADMIN: SET DEFAULT ================= */
  async setDefault(customerId, addressId) {
    try {
      await api.put(`/customers/${customerId}/addresses/${addressId}`, {
        isDefault: true
      });

      const res = await api.get(`/customers/${customerId}`);
      return res.data.addresses || [];
    } catch (err) {
      console.error("Failed to set default address", err);
      return [];
    }
  },

  /* ================= ADMIN: DELETE ADDRESS ================= */
  async remove(customerId, addressId) {
    try {
      await api.delete(`/customers/${customerId}/addresses/${addressId}`);

      const res = await api.get(`/customers/${customerId}`);
      return res.data.addresses || [];
    } catch (err) {
      console.error("Failed to delete address", err);
      return [];
    }
  }
};
