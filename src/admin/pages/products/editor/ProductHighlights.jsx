import { useEffect, useState } from "react";

/**
 * ProductHighlights
 * -----------------
 * - 4–6 short bullet points
 * - No paragraphs, no marketing words
 * - Stored as string[]
 * - Empty => auto hidden on customer side
 */

export default function ProductHighlights({ product }) {
  const [highlights, setHighlights] = useState(
    product?.highlights || []
  );

const [pasteText, setPasteText] = useState("");


  useEffect(() => {
    if (product?.highlights) {
      setHighlights(product.highlights);
    }
  }, [product]);

  const saveHighlights = updated => {
    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    const updatedProducts = products.map(p =>
      p.id === product.id
        ? { ...p, highlights: updated }
        : p
    );

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    setHighlights(updated);
  };

  const updateHighlight = (index, value) => {
    const updated = [...highlights];
    updated[index] = value;
    saveHighlights(updated);
  };

  const addHighlight = () => {
    if (highlights.length >= 6) {
      alert("Maximum 6 highlights allowed");
      return;
    }
    saveHighlights([...highlights, ""]);
  };

  const removeHighlight = index => {
    saveHighlights(
      highlights.filter((_, i) => i !== index)
    );
  };


const handlePasteHighlights = (value) => {
  setPasteText(value);

const parsed = value
  .split("\n")        // ✅ ONLY newline split
  .map(v => v.trim())
  .filter(Boolean)
  .slice(0, 6);

  if (parsed.length < 1) return;

  saveHighlights(parsed);
};


  /* ================= UI ================= */

  return (
    <div style={card}>
      <h3>Highlights</h3>

      <p style={hint}>

<div style={{ display: "grid", gap: 6 }}>
  <label style={{ fontSize: 13, fontWeight: 500 }}>
    Paste highlights (Flipkart / Amazon)
  </label>

  <textarea
    rows={4}
    placeholder={`Example:\n8 GB RAM | 256 GB ROM\n50MP Camera\n5500 mAh Battery`}
    value={pasteText}
    onChange={(e) =>
      handlePasteHighlights(e.target.value)
    }
    style={{
      padding: 10,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      fontSize: 14
    }}
  />
</div>


        4–7 short bullet points. No paragraphs. No
        marketing words.
      </p>

      {highlights.map((text, i) => (
        <div key={i} style={row}>
          <span style={bullet}>•</span>
          <input
            placeholder={`Highlight ${i + 1}`}
            value={text}
            onChange={e =>
              updateHighlight(i, e.target.value)
            }
          />
          <button
            onClick={() => removeHighlight(i)}
            style={removeBtn}
          >
            ✕
          </button>
        </div>
      ))}

      <button onClick={addHighlight} style={addBtn}>
        + Add Highlight
      </button>

      <div style={countHint}>
        {highlights.length}/6 used
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  display: "grid",
  gap: 12,
  marginBottom: 24
};

const hint = {
  fontSize: 12,
  color: "#6b7280"
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: 8
};

const bullet = {
  fontSize: 18,
  lineHeight: "1"
};

const addBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
  width: "fit-content"
};

const removeBtn = {
  background: "#fee2e2",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer"
};

const countHint = {
  fontSize: 12,
  color: "#6b7280"
};
