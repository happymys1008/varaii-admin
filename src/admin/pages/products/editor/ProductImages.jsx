import { useState, useMemo } from "react";
import api from "../../../../core/api/api";

export default function ProductImages({ product }) {

  /* ================= DEFAULT SKU (NON-VARIANT) ================= */
  const defaultSku = useMemo(() => {
    return product?.skus?.find(s => !s.colorId);
  }, [product]);

  /* ================= IMAGE STATE ================= */
  const [images, setImages] = useState(
    defaultSku?.images || []
  );

  const [uploading, setUploading] = useState(false);

  /* ================= UPLOAD IMAGE ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!defaultSku) {
      alert("Default SKU not found");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      /* 1️⃣ Upload to Cloudinary */
      const uploadRes = await api.post(
        "/products/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newImage = {
        imageUrl: uploadRes.data.imageUrl,
        cloudinaryPublicId: uploadRes.data.cloudinaryPublicId,
      };

      const updatedImages = [...images, newImage];

      /* 2️⃣ Save inside SKU (NOT PRODUCT) */
      await api.put(`/skus/${defaultSku._id}`, {
        images: updatedImages,
      });

      /* 3️⃣ Update UI */
      setImages(updatedImages);

    } catch (err) {
      console.error("Upload failed:", err.response?.data || err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= REMOVE IMAGE ================= */
  const handleRemove = async (index) => {
    if (!defaultSku) return;

    const updatedImages = images.filter((_, i) => i !== index);

    try {
      await api.put(`/skus/${defaultSku._id}`, {
        images: updatedImages,
      });

      setImages(updatedImages);

    } catch (err) {
      console.error(err);
      alert("Failed to update SKU");
    }
  };

  return (
    <section style={box}>
      <h3>Images</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />

      {uploading && <p>Uploading...</p>}

      <div style={grid}>
        {images.map((img, i) => (
          <div key={i} style={imageBox}>
            <img
              src={img.imageUrl}
              alt=""
              style={imageStyle}
            />
            <button
              onClick={() => handleRemove(i)}
              style={removeBtn}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= STYLES ================= */

const box = {
  marginBottom: 20,
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 8,
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 15,
};

const imageBox = {
  position: "relative",
};

const imageStyle = {
  width: 100,
  height: 100,
  objectFit: "cover",
  borderRadius: 8,
  border: "1px solid #ddd",
};

const removeBtn = {
  position: "absolute",
  top: -8,
  right: -8,
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 22,
  height: 22,
  cursor: "pointer",
};