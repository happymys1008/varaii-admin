import { useEffect, useMemo, useState } from "react";
import api from "../../../core/api/api";

import { listVariants } from "../../services/variantService";



export default function InventoryCategory() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [brands, setBrands] = useState([]);

const [variantsMap, setVariantsMap] = useState({});

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  /* ================= LOAD DATA ================= */

useEffect(() => {
  const fetchData = async () => {
    try {
      const [catRes, prodRes, brandRes, invRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products"),
        api.get("/brands"),
        api.get("/inventory")
      ]);
console.log("INVENTORY RAW:", invRes.data);


      // ✅ SAFE PARSE ALL

      setCategories(
        Array.isArray(catRes.data?.data)
          ? catRes.data.data
          : Array.isArray(catRes.data)
          ? catRes.data
          : []
      );

      setProducts(
        Array.isArray(prodRes.data?.data)
          ? prodRes.data.data
          : Array.isArray(prodRes.data)
          ? prodRes.data
          : []
      );

      setBrands(
        Array.isArray(brandRes.data?.data)
          ? brandRes.data.data
          : Array.isArray(brandRes.data)
          ? brandRes.data
          : []
      );

      setInventory(
        Array.isArray(invRes.data?.data)
          ? invRes.data.data
          : Array.isArray(invRes.data)
          ? invRes.data
          : []
      );

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


useEffect(() => {
  const loadVariants = async () => {
    const map = {};

    for (const product of products) {
      if (product.allowVariants) {
        try {
          const variants = await listVariants(product._id);

variants.forEach((v) => {
  map[String(v._id)] = Object.values(v.attributes || {}).join(" / ");
});


        } catch (err) {
          console.error("Variant load error", err);
        }
      }
    }

    setVariantsMap(map);
  };

  if (products.length) {
    loadVariants();
  }
}, [products]);


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
variantLabel: inv.variantId
  ? variantsMap[String(inv.variantId)] || "—"
 : <span style={{ color: "#777" }}>Non-Variant</span>,



          brand: brand?.name || "-",
          trackingType: product.trackingType,
          qty: Number(inv.qty || 0),
          imeis: inv.imeis || [],
serials: inv.serials || []
        };
      })
      .filter(Boolean);
  }, [inventory, products, brands, selectedCategoryId, variantsMap]);

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
  : row.trackingType === "IMEI"
    ? row.imeis.join(", ")
    : row.serials?.join(", ") || "-"}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
