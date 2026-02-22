import { useEffect, useState } from "react";
import api from "../../../core/api/api";


export default function Brands() {
  /* ================= STATES ================= */
  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get("/brands");
        setBrands(res.data);
      } catch (err) {
        console.error("Failed to load brands", err);
      }
    };

    fetchBrands();
  }, []);

  /* ================= ADD BRAND ================= */
  const addBrand = async () => {
    if (!newBrandName.trim()) {
      alert("Brand name required");
      return;
    }

    const cleanedName = newBrandName.trim().replace(/\s+/g, " ");

    const exists = brands.some(
      b => b.name.toLowerCase() === cleanedName.toLowerCase()
    );

    if (exists) {
      alert("Brand already exists");
      return;
    }

    try {
      const res = await api.post("/brands", {
        name: cleanedName
      });

      setBrands(prev => [...prev, res.data]);
      setNewBrandName("");
    } catch (err) {
      console.error("Failed to add brand", err);
      alert("Error adding brand");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: 20 }}>
      <h2>🏷️ Brands</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Brand name (e.g. Samsung)"
          value={newBrandName}
          onChange={e => setNewBrandName(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />

        <button
          onClick={addBrand}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Add
        </button>
      </div>

      {brands.length === 0 ? (
        <div style={{ opacity: 0.6 }}>No brands added</div>
      ) : (
        brands.map(b => (
          <div
            key={b._id}
            style={{
              padding: 10,
              marginBottom: 8,
              background: "#f1f3f5",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span style={{ fontWeight: 500 }}>{b.name}</span>
            <span style={{ fontSize: 12, color: "#198754", fontWeight: 600 }}>
              ACTIVE
            </span>
          </div>
        ))
      )}
    </div>
  );
}