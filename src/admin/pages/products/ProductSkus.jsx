import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../../core/api/api";
import AddSkuModal from "./AddSkuModal";

import { getProductById } from "../../services/productService";
import {
  listColors,
  createColor
} from "../../services/productColorService";

import {
  listSkusByColor,
  createSku,
  deleteSku
} from "../../services/skuService";

export default function ProductSkus() {
  const { id } = useParams();
  const location = useLocation();
  const fallbackName = location.state?.productName || "Selected Product";

  const [product, setProduct] = useState(null);
  const [colors, setColors] = useState([]);
  const [skusMap, setSkusMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [colorOptions, setColorOptions] = useState([]);
  const [newColorName, setNewColorName] = useState("");
const [colorImages, setColorImages] = useState([]);

  const [showSkuModal, setShowSkuModal] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(null);

/* ================= SIMPLE PRODUCT CHECK ================= */
const isSimpleProduct =
  colors.length === 0 &&
  Object.values(skusMap).flat().length === 0;

  /* ================= LOAD COLOR MASTER ================= */
  const loadColorMaster = async () => {
    try {
      const res = await api.get("/product-attributes");
      const list = res.data || [];

      const colorAttr = list.find(a => a.key === "color");
      if (colorAttr) {
        setColorOptions(colorAttr.values || []);
      }
    } catch (err) {
      console.error("Failed loading color master", err);
    }
  };

  /* ================= LOAD PRODUCT + COLORS + SKUS ================= */
const loadData = useCallback(async () => {
  try {
    setLoading(true);

    const productData = await getProductById(id);
    setProduct(productData);

    const colorData = await listColors(id);
    setColors(colorData || []);

    const skuDataMap = {};

    for (const color of colorData || []) {
      const skus = await listSkusByColor(color._id);
      skuDataMap[color._id] = skus || [];
    }

    setSkusMap(skuDataMap);
    setLoading(false);

  } catch (err) {
    console.error(err);
    setLoading(false);
  }
}, [id]);

  useEffect(() => {
    loadData();
    loadColorMaster();
  }, [loadData]);


/* ================= COLOR IMAGE UPLOAD ================= */
const handleColorImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post(
        "/product-colors/upload-image",
        formData
      );

      setColorImages(prev => [
        ...prev,
        {
          imageUrl: res.data.imageUrl,
          cloudinaryPublicId: res.data.cloudinaryPublicId
        }
      ]);
    }

    e.target.value = "";
  } catch (err) {
    console.error("Color image upload failed", err);
    alert("Image upload failed");
  }
};

  /* ================= CREATE COLOR ================= */
const handleCreateColor = async () => {

  if (!newColorName) {
    alert("Please select a color");
    return;
  }

  if (colorImages.length === 0) {
    alert("Please upload at least one image for color");
    return;
  }

  const exists = colors.some(
    c => c.colorName === newColorName
  );

  if (exists) {
    alert("Color already added for this product");
    return;
  }

  try {
    await createColor(product._id, {
      colorName: newColorName,
      images: colorImages
    });

    setNewColorName("");
    setColorImages([]);
    loadData();

  } catch (err) {
    console.error(err);
    alert("Failed to create color");
  }
};

  /* ================= OPEN SKU MODAL ================= */
  const handleCreateSku = (colorId) => {
    setSelectedColorId(colorId);
    setShowSkuModal(true);
  };

  /* ================= SAVE SKU ================= */
const handleSaveSku = async (payload) => {
  try {
    await createSku(product._id, selectedColorId, payload);

    await loadData(); // IMPORTANT

    setShowSkuModal(false);

  } catch (err) {
    console.error("Create SKU error:", err);
    alert("Failed to create SKU");
  }
};

  /* ================= DELETE SKU ================= */
  const handleDeleteSku = async (skuId) => {
    if (!window.confirm("Delete this SKU?")) return;

    try {
      await deleteSku(skuId);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete SKU");
    }
  };

 /* ================= UPDATE IMAGES (NEW) ================= */
const handleUpdateImages = async (colorId) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;

  input.onchange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const newImages = [];

      // 1️⃣ Upload all selected images
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await api.post(
          "/product-colors/upload-image",
          formData
        );

        newImages.push({
          imageUrl: res.data.imageUrl,
          cloudinaryPublicId: res.data.cloudinaryPublicId
        });
      }

      // 2️⃣ Call replace API
      await api.put(
        `/product-colors/colors/${colorId}/replace-images`,
        { images: newImages }
      );

      // 3️⃣ Reload UI
      await loadData();

      alert("Images updated successfully");

    } catch (err) {
      console.error(err);
      alert("Failed to update images");
    }
  };

  input.click();
};

if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (!product) return <div style={{ padding: 20 }}>Product not found</div>;


  return (
    <div style={{ padding: 20 }}>
<h2>
  SKUs —{" "}
  <span style={{ color: "#0b5ed7" }}>{product.name}</span>
</h2>

{isSimpleProduct && (
  <div style={{ marginTop: 6, color: "#666", fontSize: 14 }}>
    No SKUs created yet. Add at least one SKU to activate this product.
  </div>
)}

      {/* ================= ADD COLOR ================= */}
      <div style={{ marginTop: 20 }}>
        <h3>Add Color</h3>

{/* IMAGE UPLOAD */}
<div style={{ marginTop: 10 }}>
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleColorImageUpload}
/>

  {/* Preview */}
  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
    {colorImages.map((img, i) => (
      <div key={i} style={{ position: "relative" }}>
        <img
          src={img.imageUrl}
          alt="color"
          style={{
            width: 70,
            height: 70,
            objectFit: "cover",
            borderRadius: 6
          }}
        />
        <button
          onClick={() =>
            setColorImages(prev =>
              prev.filter((_, index) => index !== i)
            )
          }
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 18,
            height: 18,
            cursor: "pointer"
          }}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>

        <select
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="">Select Color</option>
          {colorOptions.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <button onClick={handleCreateColor}>
          + Add Color
        </button>
      </div>

      {/* ================= COLORS LIST ================= */}
      <div style={{ marginTop: 30 }}>
        <h3>Color Groups</h3>

        {colors.length === 0 ? (
          <div>No colors yet</div>
        ) : (
colors.map((color) => (
  <div
    key={color._id}
    style={{
      border: "1px solid #ddd",
      padding: 15,
      marginBottom: 15,
      borderRadius: 8
    }}
  >
    {/* 🔥 COLOR HEADER WITH IMAGE */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12
        }}
      >
<div style={{ display: "flex", gap: 8 }}>
  {color.images?.map((img, index) => (
    <div
      key={index}
      style={{
        position: "relative",
        width: 50,
        height: 50
      }}
    >
      <img
        src={img.imageUrl}
        alt={color.colorName}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 8,
          border: "1px solid #eee"
        }}
      />

      {/* 🔥 REMOVE BUTTON */}
      <button
        onClick={async () => {
          if (!window.confirm("Remove this image?")) return;

          try {
            const remainingImages = color.images.filter(
              (_, i) => i !== index
            );

            await api.put(
              `/product-colors/colors/${color._id}/replace-images`,
              { images: remainingImages }
            );

            await loadData();
          } catch (err) {
            console.error(err);
            alert("Failed to remove image");
          }
        }}
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 18,
          height: 18,
          cursor: "pointer",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        ✕
      </button>
    </div>
  ))}
</div>

        <h4 style={{ margin: 0 }}>
          {color.colorName}
        </h4>
      </div>

<div style={{ display: "flex", gap: 10 }}>
  <button
    onClick={() => handleUpdateImages(color._id)}
    style={{
      padding: "6px 12px",
      borderRadius: 6,
      border: "1px solid #0d6efd",
      background: "#0d6efd",
      color: "#fff",
      cursor: "pointer"
    }}
  >
    Update Images
  </button>

  <button
    onClick={() => handleCreateSku(color._id)}
    style={{
      padding: "6px 12px",
      borderRadius: 6,
      border: "1px solid #ccc",
      cursor: "pointer"
    }}
  >
    + Add SKU
  </button>
</div>
    </div>

              {skusMap[color._id]?.length === 0 ? (
                <div>No SKUs yet</div>
              ) : (
                <table width="100%" border="1" cellPadding="6">
                  <thead>
                    <tr>
<th>SKU Code</th>
{product.variantConfig?.map((variantKey) => (
  variantKey !== "COLOR" && (
    <th key={variantKey}>{variantKey}</th>
  )
))}
<th>MRP</th>
<th>Selling</th>
<th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skusMap[color._id]?.map((sku) => (
                      <tr key={sku._id}>
                        <td>{sku.skuCode}</td>
{product.variantConfig?.map((variantKey) => {
  if (variantKey === "COLOR") return null;

  const value =
    sku.attributes?.[variantKey.toLowerCase()] || "-";

  return <td key={variantKey}>{value}</td>;
})}
                        <td>₹{sku.mrp}</td>
                        <td style={{ color: "green" }}>
                          ₹{sku.sellingPrice}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleDeleteSku(sku._id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= SKU MODAL ================= */}
{showSkuModal && (
  <AddSkuModal
    product={product}   // 🔥 IMPORTANT
    productId={product._id}
    colorId={selectedColorId}
    existingSkus={skusMap[selectedColorId] || []}
    onClose={() => setShowSkuModal(false)}
    onSave={handleSaveSku}
  />
)}
    </div>
  );
}
