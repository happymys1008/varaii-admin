import { useEffect, useState } from "react";
import api from "../../../core/api/api";

export default function ProductAttributes() {
  const [attributes, setAttributes] = useState([]);
  const [attrName, setAttrName] = useState("");
  const [valueInput, setValueInput] = useState({});

  const loadAttributes = async () => {
    const res = await api.get("/product-attributes");
    setAttributes(res.data || []);
  };

  useEffect(() => {
    loadAttributes();
  }, []);

  const createAttribute = async () => {
    if (!attrName.trim()) return;
    await api.post("/product-attributes", {
      name: attrName.trim()
    });
    setAttrName("");
    loadAttributes();
  };

  const addValue = async (attrId) => {
    const val = valueInput[attrId];
    if (!val) return;

    await api.post(`/product-attributes/${attrId}/value`, {
      value: val
    });

    setValueInput(prev => ({ ...prev, [attrId]: "" }));
    loadAttributes();
  };

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      <h2>🧩 Product Attributes</h2>

      {/* CREATE ATTRIBUTE */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Attribute (RAM, STORAGE, COLOR)"
          value={attrName}
          onChange={e => setAttrName(e.target.value)}
        />
        <button onClick={createAttribute}>Add</button>
      </div>

      <hr />

      {attributes.map(attr => (
        <div
          key={attr._id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12
          }}
        >
          <h3 style={{ margin: 0 }}>{attr.name}</h3>
<small style={{ opacity: 0.6 }}>
  key: {attr.key}
</small>


          {/* VALUES */}
          <div style={{ marginTop: 8 }}>
            {attr.values.map(v => (
              <span
                key={v}
                style={{
                  padding: "4px 8px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  marginRight: 6,
                  fontSize: 12
                }}
              >
                {v}
              </span>
            ))}
          </div>

          {/* ADD VALUE */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              placeholder={`Add ${attr.name} value`}
              value={valueInput[attr._id] || ""}
              onChange={e =>
                setValueInput(prev => ({
                  ...prev,
                  [attr._id]: e.target.value
                }))
              }
            />
            <button onClick={() => addValue(attr._id)}>
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
