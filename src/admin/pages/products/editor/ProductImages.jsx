import { useState } from "react";
import api from "../../../../core/api/api";

export default function ProductImages({ product, onProductUpdate }) {
  const [images, setImages] = useState(product.images || []);
  const [uploading, setUploading] = useState(false);

  /* ================= UPLOAD IMAGE ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

const res = await api.post(
  "/products/image/upload",
  formData
);


      const newImage = {
        imageUrl: res.data.imageUrl,
        cloudinaryPublicId: res.data.cloudinaryPublicId,
      };

      const updatedImages = [...images, newImage];
      setImages(updatedImages);

      // 🔥 Immediately update product in DB
      await api.put(`/products/${product._id}`, {
        images: updatedImages,
      });

      if (onProductUpdate) {
        onProductUpdate({ ...product, images: updatedImages });
      }

    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ================= REMOVE IMAGE ================= */
  const handleRemove = async (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    try {
      await api.put(`/products/${product._id}`, {
        images: updatedImages,
      });

      if (onProductUpdate) {
        onProductUpdate({ ...product, images: updatedImages });
      }

    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  return (
    <section style={box}>
      <h3>Images</h3>

      {/* 🔥 Upload Button */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />

      {uploading && <p>Uploading...</p>}

      {/* 🔥 Image Preview Grid */}
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
