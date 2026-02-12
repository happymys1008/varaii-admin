import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE_URL;

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [activeImage, setActiveImage] = useState("");
  const [inventory, setInventory] = useState([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${API}/api/products/${id}`);
        setProduct(productRes.data);

        const catRes = await axios.get(`${API}/api/categories`);
        setCategories(catRes.data);

        const brandRes = await axios.get(`${API}/api/brands`);
        setBrands(brandRes.data);

        // ✅ REAL inventory from backend
        const invRes = await axios.get(`${API}/api/inventory`);
        setInventory(
          invRes.data.filter(i => String(i.productId) === String(id))
        );

      } catch (err) {
        console.error("Product view load failed", err);
      }
    };

    fetchData();
  }, [id]);

  /* ================= IMAGE ================= */

  useEffect(() => {
    if (product?.images?.length) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  /* ================= HELPERS ================= */

  const getCategoryName = id =>
    categories.find(c => String(c._id) === String(id))?.name || "—";

  const getBrandName = id =>
    brands.find(b => String(b._id) === String(id))?.name || "—";

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>📦 {product.name}</h2>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>

      {/* IMAGES */}
      {product.images?.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <div>
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setActiveImage(img)}
                style={{
                  width: 60,
                  height: 60,
                  border:
                    activeImage === img
                      ? "2px solid #0d6efd"
                      : "1px solid #ddd",
                  cursor: "pointer",
                  marginBottom: 6
                }}
              />
            ))}
          </div>

          <img
            src={activeImage}
            alt=""
            style={{ width: 280, height: 280, objectFit: "contain" }}
          />
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <p><b>Category:</b> {getCategoryName(product.categoryId)}</p>
        <p><b>Brand:</b> {getBrandName(product.brandId)}</p>
        <p><b>Tracking:</b> {product.trackingType}</p>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={() => setActiveTab("OVERVIEW")}>Overview</button>
        <button onClick={() => setActiveTab("INVENTORY")}>Inventory</button>
      </div>

      {activeTab === "INVENTORY" && (
        <div style={{ marginTop: 16 }}>
          {inventory.map(inv => (
            <div key={inv._id} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
              <b>Variant:</b> {inv.variantId || "Base"}  
              <br />
              <b>Stock:</b> {inv.qty}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
