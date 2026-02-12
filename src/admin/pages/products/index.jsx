import { useState } from "react";
import ProductList from "./ProductList";
import ProductsDashboard from "./ProductsDashboard";
import CreateProductModal from "./CreateProductModal";
import { useAdminCatalog } from "../../context/AdminCatalogContext";

export default function ProductsPage() {

  /* ================= ADMIN CATALOG (SINGLE SOURCE) ================= */
  const {
    products,
    categories,
    subCategories,
    childCategories,
    brands,
    inventory,
    createProduct
  } = useAdminCatalog();

  const [openCreate, setOpenCreate] = useState(false);

  /* ================= INVENTORY CALCULATION ================= */
  const simpleInventory = products
    .filter(p => p.trackingType === "QTY")
    .map(p => ({
      productId: p._id,
      variantId: null,
      qty: p.qty || 0,
      trackingType: "QTY"
    }));

  const mergedInventory = [...inventory, ...simpleInventory];

  const inventorySummary = products.map(p => {
    const qty = mergedInventory
      .filter(i => String(i.productId) === String(p._id))
      .reduce((sum, i) => sum + Number(i.qty || 0), 0);

    return {
      productId: p._id,
      qty,
      isLowStock: qty > 0 && qty <= 3,
      isOutOfStock: qty === 0
    };
  });

  /* ================= CREATE PRODUCT ================= */
const handleSaveProduct = async (payload) => {
  try {
    await createProduct(payload);

    // ✅ success signal
    return true;
  } catch (err) {
    console.error("Create product failed:", err);
    alert("❌ Product create failed");
    return false;
  }
};




  /* ================= UI ================= */
  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <h2>Products</h2>

        <button
          className="btn btn-primary"
          onClick={() => setOpenCreate(true)}
        >
          + Create Product
        </button>
      </div>

      {/* DASHBOARD */}
      <ProductsDashboard
        products={products}
        inventorySummary={inventorySummary}
      />

      {/* PRODUCT LIST */}
<ProductList
  products={products}
  inventory={mergedInventory}
  onManageVariants={(product) => {
    // 👇 yahi se product name pass hoga
    return {
      productId: product._id,
      productName: product.name
    };
  }}
/>


      {/* CREATE PRODUCT MODAL */}
      {openCreate && (
        <CreateProductModal
          categories={categories}
          subCategories={subCategories}
          childCategories={childCategories}
          brands={brands}
          onSave={handleSaveProduct}
          onClose={() => setOpenCreate(false)}
        />
      )}
    </div>
  );
}
