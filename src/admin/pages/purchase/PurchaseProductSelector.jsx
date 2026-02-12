import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../../services/productService";

/**
 * PurchaseProductSelector
 * -----------------------
 * RULES:
 * ❌ Never creates product
 * ❌ Never uses localStorage
 * ✅ Reads from MongoDB only
 * ✅ Single source of truth: /api/products
 */
export default function PurchaseProductSelector({ onSelect }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== LOAD PRODUCTS FROM MONGODB ===== */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await listProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to load products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ===== NORMALIZER ===== */
  const normalize = (v = "") =>
    v.toString().toLowerCase().trim();

  /* ===== FILTERED LIST ===== */
  const filteredProducts = useMemo(() => {
    const q = normalize(search);
    if (!q) return [];

    return products.filter(p =>
      normalize(p.name).includes(q)
    );
  }, [search, products]);

  /* ===== SELECT HANDLER ===== */
  const handleSelect = (product) => {
    onSelect({
      product: {
        id: product._id,
        name: product.name,
        trackingType: product.trackingType,
        allowVariants: product.allowVariants
      }
    });
    setSearch(product.name);
  };

  return (
    <div style={{ position: "relative", marginTop: 6 }}>
      <input
        placeholder="Search product…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc"
        }}
      />

      {search && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 6,
            marginTop: 4,
            maxHeight: 240,
            overflowY: "auto"
          }}
        >
          {/* LOADING */}
          {loading && (
            <div style={{ padding: 10, textAlign: "center" }}>
              Loading products…
            </div>
          )}

          {/* FOUND */}
          {!loading && filteredProducts.map(p => (
            <div
              key={p._id}
              onClick={() => handleSelect(p)}
              style={{
                padding: "8px 10px",
                cursor: "pointer",
                borderBottom: "1px solid #f1f1f1"
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {p.name}
              </div>

              <div style={{ fontSize: 12, color: "#666" }}>
                {p.trackingType}
                {p.allowVariants ? " • Variants" : ""}
              </div>
            </div>
          ))}

          {/* NOT FOUND */}
          {!loading && filteredProducts.length === 0 && (
            <div
              style={{
                padding: 10,
                fontSize: 13,
                color: "#999",
                textAlign: "center"
              }}
            >
              ❌ Product not found  
              <br />
              Create it from <b>Products</b> page
            </div>
          )}
        </div>
      )}
    </div>
  );
}
