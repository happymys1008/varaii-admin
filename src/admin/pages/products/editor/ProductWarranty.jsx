import { useEffect, useState } from "react";

/**
 * ProductWarranty
 * ----------------
 * - Warranty / Replacement / Seller info
 * - Optional but trust-critical section
 * - Stored as structured object
 *
 * warranty = {
 *   warrantyText: "1 Year Manufacturer Warranty",
 *   replacementPolicy: "7 Days Replacement",
 *   sellerName: "Happy Ivan Mobiles"
 * }
 */

export default function ProductWarranty({ product }) {
  const [warranty, setWarranty] = useState(
    product?.warranty || {
      warrantyText: "",
      replacementPolicy: "",
      sellerName: "Happy Ivan Mobiles"
    }
  );

  useEffect(() => {
    if (product?.warranty) {
      setWarranty({
        sellerName: "Happy Ivan Mobiles",
        ...product.warranty
      });
    }
  }, [product]);

  const saveWarranty = updated => {
    const products =
      JSON.parse(localStorage.getItem("products")) || [];

    const updatedProducts = products.map(p =>
      p.id === product.id
        ? { ...p, warranty: updated }
        : p
    );

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    setWarranty(updated);
  };

  const update = (key, value) => {
    saveWarranty({ ...warranty, [key]: value });
  };

  /* ================= UI ================= */

  return (
    <div style={card}>
      <h3>Warranty & Trust</h3>

      <p style={hint}>
        This section builds customer trust and answers
        “safe hai ya nahi?”
      </p>

      {/* WARRANTY */}
      <input
        placeholder="Warranty (eg: 1 Year Manufacturer Warranty)"
        value={warranty.warrantyText}
        onChange={e =>
          update("warrantyText", e.target.value)
        }
      />

      {/* REPLACEMENT */}
      <input
        placeholder="Replacement Policy (eg: 7 Days Replacement)"
        value={warranty.replacementPolicy}
        onChange={e =>
          update("replacementPolicy", e.target.value)
        }
      />

      {/* SELLER */}
      <input
        placeholder="Seller Name"
        value={warranty.sellerName}
        onChange={e =>
          update("sellerName", e.target.value)
        }
      />
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
