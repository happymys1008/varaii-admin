import { useState } from "react";

export default function ProductSpecifications({ product }) {
  const [sections, setSections] = useState(
    product.specifications || []
  );
  const [pasteText, setPasteText] = useState("");

  /* =====================
     PASTE PARSER (FLIPKART STYLE)
     ===================== */
const handlePasteSpecs = (value) => {
  setPasteText(value);

  const lines = value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const parsedSections = [];
  let currentSection = null;
  let pendingKey = null;

  lines.forEach(line => {
    // 🟦 SECTION TITLE
    if (
      /^[A-Za-z &]+$/.test(line) &&
      line.length < 40 &&
      !pendingKey
    ) {
      currentSection = {
        title: line,
        specs: []
      };
      parsedSections.push(currentSection);
      return;
    }

    // 🟨 KEY (expects value on next line)
    if (currentSection && !pendingKey) {
      pendingKey = line;
      return;
    }

    // 🟩 VALUE (can be long / paragraph)
    if (currentSection && pendingKey) {
      currentSection.specs.push({
        key: pendingKey,
        value: line
      });
      pendingKey = null;
    }
  });

  if (parsedSections.length) {
    setSections(parsedSections);
  }
};


  /* =====================
     MANUAL CONTROLS
     ===================== */

  const addSection = () => {
    setSections(prev => [
      ...prev,
      { title: "", specs: [{ key: "", value: "" }] }
    ]);
  };

  const updateSectionTitle = (i, value) => {
    const updated = [...sections];
    updated[i].title = value;
    setSections(updated);
  };

  const addSpec = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].specs.push({
      key: "",
      value: ""
    });
    setSections(updated);
  };

  const updateSpec = (sectionIndex, specIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex].specs[specIndex][field] = value;
    setSections(updated);
  };

  const removeSpec = (sectionIndex, specIndex) => {
    const updated = [...sections];
    updated[sectionIndex].specs.splice(specIndex, 1);
    setSections(updated);
  };

  const saveSpecs = () => {
    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    const updated = products.map(p =>
      p.id === product.id
        ? { ...p, specifications: sections }
        : p
    );

    localStorage.setItem("products", JSON.stringify(updated));
    window.dispatchEvent(new Event("dataUpdated"));

    alert("Specifications saved");
  };

const clearAllSpecs = () => {
  const confirmClear = window.confirm(
    "Are you sure? All specifications will be removed."
  );

  if (!confirmClear) return;

  setSections([]);
  setPasteText("");
};


  /* =====================
     UI
     ===================== */

  return (
    <section style={box}>
      <h3>Specifications</h3>
<div
  style={{
    display: "flex",
    gap: 10,
    marginBottom: 12
  }}
>
  <button
    onClick={clearAllSpecs}
    style={{
      background: "#fee2e2",
      border: "1px solid #fecaca",
      color: "#991b1b",
      padding: "6px 12px",
      borderRadius: 6,
      cursor: "pointer"
    }}
  >
    Clear All Sections
  </button>
</div>


      {/* 🔥 PASTE BOX */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600 }}>
          Paste Specifications (Flipkart / Amazon)
        </label>

        <textarea
          rows={8}
          value={pasteText}
          onChange={(e) =>
            handlePasteSpecs(e.target.value)
          }
          placeholder={`Example:
OS & Processor Features
Operating System Android 15
Processor Brand Snapdragon
Processor Type 7s Gen 2

Battery & Power Features
Battery Capacity 5500 mAh`}
          style={{
            width: "100%",
            marginTop: 6,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />
      </div>

      {!sections.length && (
        <div style={{ opacity: 0.6, marginBottom: 10 }}>
          No specifications added yet
        </div>
      )}

      {sections.map((section, i) => (
        <div key={i} style={sectionBox}>
          <input
            placeholder="Section title (eg: Display Features)"
            value={section.title}
            onChange={e =>
              updateSectionTitle(i, e.target.value)
            }
            style={{ fontWeight: 600 }}
          />

          {section.specs.map((spec, j) => (
            <div
              key={j}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: 8,
                marginTop: 6
              }}
            >
              <input
                placeholder="Key"
                value={spec.key}
                onChange={e =>
                  updateSpec(i, j, "key", e.target.value)
                }
              />

              <input
                placeholder="Value"
                value={spec.value}
                onChange={e =>
                  updateSpec(i, j, "value", e.target.value)
                }
              />

              <button onClick={() => removeSpec(i, j)}>
                ❌
              </button>
            </div>
          ))}

          <button
            onClick={() => addSpec(i)}
            style={{ marginTop: 8 }}
          >
            + Add Spec
          </button>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={addSection}>
          + Add Section
        </button>
        <button onClick={saveSpecs}>
          Save Specifications
        </button>
      </div>
    </section>
  );
}

/* =====================
   STYLES
   ===================== */

const box = {
  marginBottom: 20,
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 8
};

const sectionBox = {
  padding: 12,
  border: "1px solid #eee",
  borderRadius: 8,
  marginBottom: 12
};
