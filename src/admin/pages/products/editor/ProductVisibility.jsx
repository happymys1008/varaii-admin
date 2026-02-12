import { useEffect, useState } from "react";

/**
 * ProductVisibility
 * ------------------
 * - Show on Shop
 * - Show on Home
 * - Featured Product
 * - Draft / Published status
 *
 * visibility = {
 *   showOnShop: true,
 *   showOnHome: false,
 *   featured: false
 * }
 *
 * status = "draft" | "published"
 */

export default function ProductVisibility({ product }) {
  const [visibility, setVisibility] = useState(
    product?.visibility || {
      showOnShop: true,
      showOnHome: false,
      featured: false
    }
  );

  const [status, setStatus] = useState(
    product?.status || "draft"
  );

  useEffect(() => {
    if (product) {
      setVisibility({
        showOnShop: true,
        showOnHome: false,
        featured: false,
        ...(product.visibility || {})
      });

      setStatus(product.status || "draft");
    }
  }, [product]);

  const saveVisibility = (updatedVisibility, updatedStatus) => {
    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    const updatedProducts = products.map(p =>
      p.id === product.id
        ? {
            ...p,
            visibility: updatedVisibility,
            status: updatedStatus
          }
        : p
    );

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    setVisibility(updatedVisibility);
    setStatus(updatedStatus);
  };

  const toggle = key => {
    saveVisibility(
      { ...visibility, [key]: !visibility[key] },
      status
    );
  };

  const publish = () => {
    saveVisibility(visibility, "published");
  };

  const saveDraft = () => {
    saveVisibility(visibility, "draft");
  };

  /* ================= UI ================= */

  return (
    <div style={card}>
      <h3>Visibility & Publishing</h3>

      <p style={hint}>
        Control where this product appears and when it
        becomes visible to customers.
      </p>

      {/* TOGGLES */}
      <label style={row}>
        <input
          type="checkbox"
          checked={visibility.showOnShop}
          onChange={() => toggle("showOnShop")}
        />
        <span>Show on Shop</span>
      </label>

      <label style={row}>
        <input
          type="checkbox"
          checked={visibility.showOnHome}
          onChange={() => toggle("showOnHome")}
        />
        <span>Show on Home</span>
      </label>

      <label style={row}>
        <input
          type="checkbox"
          checked={visibility.featured}
          onChange={() => toggle("featured")}
        />
        <span>Featured Product</span>
      </label>

      {/* STATUS */}
      <div style={statusBox}>
        <b>Status:</b>{" "}
        <span
          style={{
            color:
              status === "published"
                ? "#198754"
                : "#6b7280"
          }}
        >
          {status === "published"
            ? "Published"
            : "Draft"}
        </span>
      </div>

      {/* ACTIONS */}
      <div style={actions}>
        <button onClick={saveDraft} style={draftBtn}>
          Save as Draft
        </button>

        <button onClick={publish} style={publishBtn}>
          Publish
        </button>
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
  gap: 10,
  fontSize: 14
};

const statusBox = {
  marginTop: 10,
  fontSize: 14
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 10
};

const draftBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer"
};

const publishBtn = {
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer"
};
