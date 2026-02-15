import api from "../../core/api/api";

/* ===============================
   PROFILE SCHEMA SERVICE (API)
=============================== */

export const profileSchemaService = {
  /* 🔹 GET ALL */
  async getAll() {
    const res = await api.get("/profile-schema");
    return res.data || {};
  },

  /* 🔹 TOGGLE FIELD */
  async toggleField(fieldKey) {
    const current = await this.getAll();

    const updated = {
      ...current,
      [fieldKey]: {
        ...current[fieldKey],
        enabled: !current[fieldKey]?.enabled,
      },
    };

    await api.put("/profile-schema", updated);

    return updated;
  },
};
