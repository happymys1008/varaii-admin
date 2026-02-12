import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE_URL;

export default function InventoryCategory() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, brandRes, invRes] = await Promise.all([
          axios.get(`${API}/api/categories`),
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/brands`),
          axios.get(`${API}/api/inventory`)
        ]);

        setCategories(catRes.data || []);
        setProducts(prodRes.data || []);
        setBrands(brandRes.data || []);
        setInventory(invRes.data || []);
      } catch (err) {
        console.error("Inventory load failed", err);
      }
    };

    fetchData();
  }, []);

  /* ================= AUTO SELECT CATEGORY ================= */

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(String(categories[0]._id));
    }
  }, [categories, selectedCategoryId]);

  /* ================= BUILD ROWS ================= */

  const rows = useMemo(() => {
    return inventory
      .map((inv) => {
        const product = products.find(
          (p) => String(p._id) === String(inv.productId)
        );
        if (!product) return null;

        if (String(product.categoryId) !== String(selectedCategoryId)) {
          return null;
        }

        const brand = brands.find(
          (b) => String(b._id) === String(product.brandId)
        );

        return {
          productName: product.name,
          variantLabel: inv.variantId ? "Variant" : "—",
          brand: brand?.name || "-",
          trackingType: product.trackingType,
          qty: Number(inv.qty || 0),
          imeis: inv.imeis || []
        };
      })
      .filter(Boolean);
  }, [inventory, products, brands, selectedCategoryId]);

  /* ================= UI ================= */

  return (
    <div>
      <h2>📦 Inventory</h2>

      <select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        style={{ padding: 8, width: 260, marginBottom: 20 }}
      >
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {selectedCategoryId && (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Brand</th>
              <th>Tracking</th>
              <th>Qty</th>
              <th>IMEI / Serial</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                  No inventory found
                </td>
              </tr>
            )}

            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.productName}</td>
                <td>{row.variantLabel}</td>
                <td>{row.brand}</td>
                <td align="center">{row.trackingType}</td>
                <td align="center">{row.qty}</td>
                <td>
                  {row.trackingType === "QTY"
                    ? "-"
                    : row.imeis.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
