const KEY = "customer_profile_schema";

const defaultSchema = [
  {
    key: "altPhone",
    label: "Alternate Mobile Number",
    type: "text",
    enabled: false
  },
  {
    key: "dob",
    label: "Date of Birth",
    type: "date",
    enabled: false
  },
  {
    key: "anniversary",
    label: "Anniversary Date",
    type: "date",
    enabled: false
  }
];

export const profileSchemaService = {
  getAll() {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (!data) {
      localStorage.setItem(KEY, JSON.stringify(defaultSchema));
      return defaultSchema;
    }
    return data;
  },

  toggleField(fieldKey) {
    const schema = this.getAll().map(f =>
      f.key === fieldKey
        ? { ...f, enabled: !f.enabled }
        : f
    );

    localStorage.setItem(KEY, JSON.stringify(schema));
    return schema;
  }
};
