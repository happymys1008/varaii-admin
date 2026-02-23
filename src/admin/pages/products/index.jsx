import { useState, useEffect } from "react";
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
  createProduct,
  reloadProducts,
  productsMeta
} = useAdminCatalog();

  const [openCreate, setOpenCreate] = useState(false);

/* ================= FILTER STATE ================= */
const [search, setSearch] = useState("");
const [selectedBrand, setSelectedBrand] = useState("");
const [stockFilter, setStockFilter] = useState("");
const [page, setPage] = useState(1);

/* ================= CATEGORY FILTER STATE ================= */
const [selectedCategory, setSelectedCategory] = useState("");
const [selectedSubCategory, setSelectedSubCategory] = useState("");
const [selectedChildCategory, setSelectedChildCategory] = useState("");

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


useEffect(() => {
  reloadProducts({
    page,
    limit: 20,
    search,
    brand: selectedBrand,
    category: selectedCategory,
    subCategory: selectedSubCategory,
    childCategory: selectedChildCategory,
    stock: stockFilter
  });
}, [
  page,
  search,
  selectedBrand,
  selectedCategory,
  selectedSubCategory,
  selectedChildCategory,
  stockFilter
]);






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

{/* FILTER BAR */}
<div
  style={{
    display: "flex",
    gap: 15,
    marginBottom: 20,
    alignItems: "center"
  }}
>
  {/* SEARCH */}
  <input
    placeholder="Search product..."
    value={search}
    onChange={e => {
      setPage(1);
      setSearch(e.target.value);
    }}
    style={{
      padding: 8,
      width: 250,
      borderRadius: 6,
      border: "1px solid #ccc"
    }}
  />

{/* CATEGORY FILTER */}
<select
  value={selectedCategory}
  onChange={e => {
    setPage(1);
    setSelectedCategory(e.target.value);
    setSelectedSubCategory("");
    setSelectedChildCategory("");
  }}
  style={{
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc"
  }}
>
  <option value="">All Categories</option>
  {categories.map(c => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</select>


{/* SUBCATEGORY FILTER */}
<select
  value={selectedSubCategory}
  onChange={e => {
    setPage(1);
    setSelectedSubCategory(e.target.value);
    setSelectedChildCategory("");
  }}
  style={{
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc"
  }}
>
  <option value="">All SubCategories</option>
  {subCategories
    .filter(sc => sc.categoryId === selectedCategory)
    .map(sc => (
      <option key={sc._id} value={sc._id}>
        {sc.name}
      </option>
    ))}
</select>

{/* CHILD CATEGORY FILTER */}
<select
  value={selectedChildCategory}
  onChange={e => {
    setPage(1);
    setSelectedChildCategory(e.target.value);
  }}
  style={{
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc"
  }}
>
  <option value="">All Child Categories</option>
  {childCategories
    .filter(cc => cc.subCategoryId === selectedSubCategory)
    .map(cc => (
      <option key={cc._id} value={cc._id}>
        {cc.name}
      </option>
    ))}
</select>

  {/* BRAND FILTER */}
  <select
    value={selectedBrand}
    onChange={e => {
      setPage(1);
      setSelectedBrand(e.target.value);
    }}
    style={{
      padding: 8,
      borderRadius: 6,
      border: "1px solid #ccc"
    }}
  >
    <option value="">All Brands</option>
    {brands.map(b => (
      <option key={b._id} value={b._id}>
        {b.name}
      </option>
    ))}
  </select>

  {/* STOCK FILTER */}
  <select
    value={stockFilter}
    onChange={e => {
      setPage(1);
      setStockFilter(e.target.value);
    }}
    style={{
      padding: 8,
      borderRadius: 6,
      border: "1px solid #ccc"
    }}
  >
    <option value="">All Stock</option>
    <option value="available">Available</option>
    <option value="out">Out of Stock</option>
  </select>
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


{/* PAGINATION */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 20
  }}
>
  <button
    disabled={productsMeta.page <= 1}
    onClick={() => setPage(prev => prev - 1)}
    className="btn btn-secondary"
  >
    Previous
  </button>

  <span style={{ padding: "6px 12px" }}>
    Page {productsMeta.page} of {productsMeta.totalPages}
  </span>

  <button
    disabled={productsMeta.page >= productsMeta.totalPages}
    onClick={() => setPage(prev => prev + 1)}
    className="btn btn-secondary"
  >
    Next
  </button>
</div>


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
