import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateProduct } from "../../services/productService";



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
    products,
    categories,
    subCategories,
    childCategories,
    brands,
    productsLoading   // ✅ CORRECT FLAG
  } = useAdminCatalog();

  const isCreate = !id;
  const [product, setProduct] = useState(null);


  /* ================= LOAD PRODUCT (EDIT MODE) ================= */
  useEffect(() => {
    if (isCreate) return;
    if (!products || products.length === 0) return;

    const existing = products.find(
      p => String(p._id || p.id) === String(id)   // ✅ STRONG GUARD
    );

    if (existing) {
      setProduct(existing);
    }
  }, [id, isCreate, products]);




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
    const updatedProduct = await updateProduct({
      _id: product._id,
      ...formProduct,
      hasVariants: product?.hasVariants
    });

    setProduct(updatedProduct);

    alert("Saved successfully ✅");
  } catch (err) {
    console.error("❌ Save failed", err);
    alert("Save failed. Please try again.");
  }
}}
/>


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
