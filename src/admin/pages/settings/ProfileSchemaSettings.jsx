import { useEffect, useState } from "react";
import { getProfileSchema, saveProfileSchema } from "../../../utils/profileSchema";

export default function ProfileSchemaSettings() {
  const [schema, setSchema] = useState({});

  /* ================= LOAD SCHEMA ================= */
  useEffect(() => {
    setSchema(getProfileSchema());
  }, []);

  /* ================= TOGGLES ================= */
  const toggleEnabled = (key) => {
    const updated = {
      ...schema,
      [key]: {
        ...schema[key],
        enabled: !schema[key].enabled
      }
    };
    setSchema(updated);
    saveProfileSchema(updated);
  };

  const toggleRequired = (key) => {
    const updated = {
      ...schema,
      [key]: {
        ...schema[key],
        required: !schema[key].required
      }
    };
    setSchema(updated);
    saveProfileSchema(updated);
  };

  if (!Object.keys(schema).length) {
    return <p>Loading schema…</p>;
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Customer Profile Schema</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Control customer profile fields (future-proof, no hard-coding)
      </p>

      {Object.keys(schema).map((key) => (
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
            {/* ENABLE */}
            <label style={{ fontSize: 13 }}>
              <input
                type="checkbox"
                checked={schema[key].enabled}
                onChange={() => toggleEnabled(key)}
              />{" "}
              Enable
            </label>

            {/* REQUIRED */}
            <label style={{ fontSize: 13 }}>
              <input
                type="checkbox"
                checked={schema[key].required}
                disabled={!schema[key].enabled}
                onChange={() => toggleRequired(key)}
              />{" "}
              Required
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
