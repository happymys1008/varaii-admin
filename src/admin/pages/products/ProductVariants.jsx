import { useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import AddVariantModal from "./AddVariantModal";
import EditVariantModal from "./EditVariantModal";

// ✅ SERVICES (single source of truth)
import { getProductById } from "../../services/productService";
import {
  listVariants,
  createVariant   // ✅ STEP-2B ADD
} from "../../services/variantService";

export default function ProductVariants() {
  const { id } = useParams();
  const location = useLocation();

  // ✅ STEP-1 fallback (from navigation state)
  const fallbackName = location.state?.productName || "Selected Product";

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  /* ================= LOAD DATA ================= */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // 1️⃣ Load variants (fast & safe)
      const variantData = await listVariants(id);
      setVariants(Array.isArray(variantData) ? variantData : []);

      // 2️⃣ Load real product from backend
      try {
        const productData = await getProductById(id);

        setProduct(productData);
      } catch {
        // 🔒 fallback if backend fails
        setProduct({
          _id: id,
          name: fallbackName,
          allowVariants: true
        });
      }

      setLoading(false);
    } catch (err) {
      console.error(err);

      // 🔒 absolute fallback
      setProduct({
        _id: id,
        name: fallbackName,
        allowVariants: true
      });

      setVariants([]);
      setLoading(false);
    }
  }, [id, fallbackName]);


  /* ================= SAVE NEW VARIANT ================= */
  const handleCreateVariant = async (variantPayload) => {
    try {
      await createVariant(product._id, variantPayload);

      setShowCreateModal(false);

      // 🔄 reload variants
      loadData();
    } catch (err) {
      console.error("Create variant failed:", err);
      alert("❌ Failed to save variant");
    }
  };


  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ================= GUARDS ================= */
  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;

  if (!product)
    return <div style={{ padding: 20 }}>❌ Product not found</div>;

  if (!product.allowVariants)
    return (
      <div style={{ padding: 20, background: "#fff3cd" }}>
        Variants disabled for this product
      </div>
    );

  /* ================= UI ================= */
  return (
    <div style={{ padding: 20 }}>
      <h2>
        Variants —{" "}
        <span style={{ color: "#0b5ed7" }}>{product.name}</span>
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16
        }}
      >
        <h3>Saved Variants</h3>
        <button onClick={() => setShowCreateModal(true)}>
          + Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div style={{ padding: 30, background: "#f8f9fa" }}>
          No variants yet
        </div>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", marginTop: 16 }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Variant</th>
              <th>Image</th>
              <th>MRP</th>
              <th>Selling</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {variants.map((v, i) => (
              <tr key={v._id}>
                <td>{i + 1}</td>

                <td>
                  {Object.entries(v.attributes || {}).map(([k, val]) => (
                    <div key={k}>
                      <b>{k}:</b> {val}
                    </div>
                  ))}
                </td>

                <td>
                  {v.defaultImage && (
                    <img
                      src={v.defaultImage}
                      alt=""
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6
                      }}
                    />
                  )}
                </td>

                <td>₹{v.mrp}</td>
                <td style={{ color: "#198754", fontWeight: 600 }}>
                  ₹{v.sellingPrice}
                </td>

                <td>
                  {Math.round(
                    ((v.mrp - v.sellingPrice) / v.mrp) * 100
                  )}
                  %
                </td>

                <td>
                  <button
                    onClick={() => {
                      setEditingVariant(v);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ADD MODAL */}
      {showCreateModal && (
<AddVariantModal
  product={product}
  existingVariants={variants}
  onClose={() => setShowCreateModal(false)}
  onSave={handleCreateVariant}   // ✅ REAL SAVE
/>

      )}

      {/* EDIT MODAL */}
      {showEditModal && editingVariant && (
        <EditVariantModal
          variant={editingVariant}
          existingVariants={variants}
          onClose={() => {
            setShowEditModal(false);
            setEditingVariant(null);
          }}
          onSave={loadData}
        />
      )}
    </div>
  );
}
