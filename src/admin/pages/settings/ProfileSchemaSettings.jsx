import { useEffect, useState } from "react";
import api from "../../../core/api/api"; // 🔥 USE CORE API (single source)

export default function ProfileSchemaSettings() {
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= LOAD SCHEMA FROM BACKEND ================= */
  useEffect(() => {
    async function loadSchema() {
      try {
        const res = await api.get("/profile-schema");

        // first time null aa sakta hai → safe fallback
        setSchema(res.data || {});
      } catch (err) {
        console.error("Failed to load schema", err);
      } finally {
        setLoading(false);
      }
    }

    loadSchema();
  }, []);

  /* ================= SAVE TO BACKEND ================= */
  const saveToBackend = async (updated) => {
    try {
      await api.put("/profile-schema", updated);
    } catch (err) {
      console.error("Failed to save schema", err);
    }
  };

  /* ================= TOGGLES ================= */
  const toggleEnabled = (key) => {
    const updated = {
      ...schema,
      [key]: {
        ...schema[key],
        enabled: !schema[key]?.enabled
      }
    };

    setSchema(updated);
    saveToBackend(updated);
  };

  const toggleRequired = (key) => {
    const updated = {
      ...schema,
      [key]: {
        ...schema[key],
        required: !schema[key]?.required
      }
    };

    setSchema(updated);
    saveToBackend(updated);
  };

  /* ================= LOADING ================= */
  if (loading) return <p>Loading schema…</p>;
  if (!Object.keys(schema).length) return <p>No schema found</p>;

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Customer Profile Schema</h2>

      <p style={{ color: "#666", marginBottom: 20 }}>
        Control customer profile fields (Mongo driven — no local storage)
      </p>

      {Object.keys(schema).map((key) => {
        if (key === "_version") return null;

        return (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #eee"
            }}
          >
            <strong>{key}</strong>

            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={schema[key]?.enabled}
                  onChange={() => toggleEnabled(key)}
                />{" "}
                Enable
              </label>

              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={schema[key]?.required}
                  disabled={!schema[key]?.enabled}
                  onChange={() => toggleRequired(key)}
                />{" "}
                Required
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
