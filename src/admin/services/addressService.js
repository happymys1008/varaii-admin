const ADDRESS_KEY = "customer_addresses";

export const addressService = {
  /* ================= ADMIN: GET BY CUSTOMER ================= */
  async getByCustomer(customerId) {
    const addresses =
      JSON.parse(localStorage.getItem(ADDRESS_KEY)) || [];

    return addresses.filter(
      a => String(a.customerId) === String(customerId)
    );
  },

  /* ================= ADMIN: TOGGLE ACTIVE ================= */
  async toggleActive(addressId) {
    let addresses =
      JSON.parse(localStorage.getItem(ADDRESS_KEY)) || [];

    addresses = addresses.map(a =>
      a.id === addressId
        ? {
            ...a,
            isActive: a.isActive === false ? true : false,
            updatedAt: new Date().toISOString()
          }
        : a
    );

    localStorage.setItem(
      ADDRESS_KEY,
      JSON.stringify(addresses)
    );

    return addresses;
  },

  /* ================= ADMIN: SET DEFAULT (PER CUSTOMER) ================= */
  async setDefault(addressId) {
    let addresses =
      JSON.parse(localStorage.getItem(ADDRESS_KEY)) || [];

    const target = addresses.find(a => a.id === addressId);
    if (!target) return addresses;

    const customerId = target.customerId;

    addresses = addresses.map(a => {
      if (String(a.customerId) !== String(customerId)) return a;

      return {
        ...a,
        isDefault: a.id === addressId,
        updatedAt:
          a.id === addressId ? new Date().toISOString() : a.updatedAt
      };
    });

    localStorage.setItem(
      ADDRESS_KEY,
      JSON.stringify(addresses)
    );

    return addresses.filter(
      a => String(a.customerId) === String(customerId)
    );
  }
};