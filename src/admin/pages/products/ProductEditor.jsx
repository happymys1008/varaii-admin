import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateProduct } from "../../services/productService";
import api from "../../../core/api/api";



/* ✅ ADMIN CATALOG = SINGLE SOURCE */
import { useAdminCatalog } from "../../context/AdminCatalogContext";

import ProductBasicInfo from "./editor/ProductBasicInfo";
import ProductImages from "./editor/ProductImages";
import ProductHighlights from "./editor/ProductHighlights";
import ProductSpecifications from "./editor/ProductSpecifications";
import ProductWarranty from "./editor/ProductWarranty";
import ProductVisibility from "./editor/ProductVisibility";

export default function ProductEditor() {
  const { id } = useParams();


const {
  categories,
  subCategories,
  childCategories,
  brands,
  productsLoading
} = useAdminCatalog();

  const isCreate = !id;
  const [product, setProduct] = useState(null);


  /* ================= LOAD PRODUCT (EDIT MODE) ================= */
useEffect(() => {
  if (isCreate) return;

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed loading product", err);
    }
  };

  loadProduct();
}, [id, isCreate]);




  /* ================= LOADING STATE ================= */
  if (!isCreate && productsLoading) {
    return <p>Loading product…</p>;
  }

  /* ================= UI ================= */
  return (
    <div className="admin-page" style={{ padding: 20 }}>
      <h2>{isCreate ? "Create Product" : "Edit Product"}</h2>

      {/* STEP 1–2 : BASIC INFO */}
<ProductBasicInfo
  product={product || null}
  categories={categories}
  subCategories={subCategories}
  childCategories={childCategories}
  brands={brands}
onSave={async ({ product: formProduct }) => {
  try {
    await updateProduct({
      _id: product._id,
      ...formProduct,
      hasVariants: product?.hasVariants
    });

    // 🔥 IMPORTANT: reload full product with SKUs
    const fresh = await api.get(`/products/${product._id}`);
    setProduct(fresh.data);

    alert("Saved successfully ✅");

  } catch (err) {
    console.error("❌ Save failed", err);
    alert("Save failed. Please try again.");
  }
}}/>


      {/* STEP 3+ : UNLOCK AFTER SAVE */}
      {product && (
        <>
          <ProductImages product={product} />
          <ProductHighlights product={product} />
          <ProductSpecifications product={product} />
          <ProductWarranty product={product} />
          <ProductVisibility product={product} />
        </>
      )}
    </div>
  );
}