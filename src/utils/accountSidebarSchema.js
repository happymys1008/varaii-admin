// src/utils/accountSidebarSchema.js

const SCHEMA_VERSION = 1;
const STORAGE_KEY = "account_sidebar_schema";

/**
 * 🔐 DEFAULT ACCOUNT SIDEBAR SCHEMA
 * Single Source of Truth
 * Future-proof (Admin → Customer auto sync)
 */
const DEFAULT_ACCOUNT_SIDEBAR_SCHEMA = {
  _version: SCHEMA_VERSION,

  orders: {
    enabled: true,
    label: "📦 Orders",
    path: "/account/orders"
  },

  profile: {
    enabled: true,
    label: "👤 Personal Details",
    path: "/account/profile"
  },

  address: {
    enabled: true,
    label: "📍 Saved Address",
    path: "/account/address"
  }
};

/* ================= MERGE SCHEMA (SAFE) ================= */
const mergeSchema = (saved, defaults) => {
  const merged = { ...defaults };

  Object.keys(defaults).forEach((key) => {
    if (saved?.[key] && key !== "_version") {
      merged[key] = {
        ...defaults[key],
        ...saved[key]
      };
    }
  });

  return merged;
};

/* ================= GET SCHEMA ================= */
export const getAccountSidebarSchema = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && saved._version === SCHEMA_VERSION) {
      return mergeSchema(saved, DEFAULT_ACCOUNT_SIDEBAR_SCHEMA);
    }
  } catch (err) {
    console.error("Failed to load account sidebar schema", err);
  }

  // 🟢 SAFE FALLBACK
  return DEFAULT_ACCOUNT_SIDEBAR_SCHEMA;
};

/* ================= SAVE SCHEMA (ADMIN) ================= */
export const saveAccountSidebarSchema = (schema) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...schema,
      _version: SCHEMA_VERSION
    })
  );

  // 🔥 INSTANT CUSTOMER SYNC
  window.dispatchEvent(new Event("account-sidebar-update"));
};
