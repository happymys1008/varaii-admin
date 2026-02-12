// src/utils/profileSchema.js

/* =========================================================
   Customer Profile Schema
   - Future-proof
   - Versioned
   - Mongo / API ready
   ========================================================= */

const SCHEMA_VERSION = 1;

/* ================= DEFAULT SCHEMA ================= */
const DEFAULT_PROFILE_SCHEMA = {
  _version: SCHEMA_VERSION, // ⚠️ system key (UI me use nahi karna)

  firstName: { enabled: true, required: true },
  lastName: { enabled: true, required: false },
  email: { enabled: true, required: true },
  address: { enabled: true, required: true },

  secondaryPhone: { enabled: false, required: false },
  dob: { enabled: false, required: false },
  anniversary: { enabled: false, required: false }
};

/* ================= MERGE SCHEMA ================= */
/**
 * Safely merge saved schema with defaults
 * - New fields auto add ho jaate hain
 * - Old data kabhi break nahi hota
 */
const mergeSchema = (saved, defaults) => {
  const merged = { ...defaults };

  Object.keys(defaults).forEach((key) => {
    if (saved?.[key]) {
      merged[key] = {
        ...defaults[key],
        ...saved[key]
      };
    }
  });

  return merged;
};

/* ================= GET SCHEMA ================= */
/**
 * Used by Customer UI
 */
export const getProfileSchema = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("profile_schema"));

    if (saved && saved._version === SCHEMA_VERSION) {
      return mergeSchema(saved, DEFAULT_PROFILE_SCHEMA);
    }
  } catch (error) {
    console.error("Failed to load profile schema", error);
  }

  return DEFAULT_PROFILE_SCHEMA;
};

/* ================= SAVE SCHEMA ================= */
/**
 * Used by Admin Panel
 */
export const saveProfileSchema = (schema) => {
  localStorage.setItem(
    "profile_schema",
    JSON.stringify({
      ...schema,
      _version: SCHEMA_VERSION
    })
  );
};
