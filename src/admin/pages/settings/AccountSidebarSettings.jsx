import { useEffect, useState } from "react";
import {
  getAccountSidebarSchema,
  saveAccountSidebarSchema
} from "../../../utils/accountSidebarSchema";

const SYSTEM_KEYS = ["_version"];

export default function AccountSidebarSettings() {
  const [schema, setSchema] = useState({});

  /* ================= LOAD SCHEMA ================= */
  useEffect(() => {
    const loaded = getAccountSidebarSchema();
    setSchema(loaded || {});
  }, []);

  /* ================= TOGGLE ENABLE ================= */
  const toggleEnable = (key) => {
    if (!schema[key]) return;

    const updated = {
      ...schema,
      [key]: {
        ...schema[key],
        enabled: !schema[key].enabled
      }
    };

    setSchema(updated);
    saveAccountSidebarSchema(updated);
// 🔥 FORCE CUSTOMER UPDATE
  window.dispatchEvent(new Event("account-sidebar-update"));
  };

  /* ================= ADD NEW MENU ================= */
  const addNewMenu = () => {
    const key = prompt("Menu key (e.g. wishlist)");
    if (!key) return;

    // ❌ prevent overwrite
    if (schema[key]) {
      alert("Menu key already exists");
      return;
    }

    const label = prompt("Menu label (e.g. Wishlist)");
    if (!label) return;

    const path = prompt("Route path (e.g. /account/wishlist)");
    if (!path) return;

    const updated = {
      ...schema,
      [key]: {
        enabled: true,
        label,
        path
      }
    };

    setSchema(updated);
    saveAccountSidebarSchema(updated);
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Account Sidebar Settings</h2>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Enable / disable customer account menu items (schema driven)
      </p>

      {/* 🔥 MENU LIST */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden"
        }}
      >
        {Object.keys(schema)
          .filter((key) => !SYSTEM_KEYS.includes(key))
          .map((key) => {
            const item = schema[key];
            if (!item) return null;

            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: "1px solid #eee"
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#888"
                    }}
                  >
                    {item.path}
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={!!item.enabled}
                  onChange={() => toggleEnable(key)}
                />
              </div>
            );
          })}
      </div>

      {/* ➕ ADD MENU */}
      <button
        onClick={addNewMenu}
        style={{
          marginTop: 16,
          padding: "8px 14px",
          background: "#0b5ed7",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        ➕ Add New Menu
      </button>

      <p style={{ fontSize: 12, color: "#999", marginTop: 10 }}>
        Changes reflect instantly on customer account sidebar
      </p>
    </div>
  );
}
