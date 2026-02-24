import { useEffect, useMemo, useState } from "react";
import { useAdminCatalog } from "../../context/AdminCatalogContext";
import "./InventoryCategory.css";

export default function InventoryCategory() {

  const {
    products,
    categories,
    subCategories,
    childCategories,
    brands,
    inventory
  } = useAdminCatalog();

  /* ================= LOCAL STATE ================= */
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedChildCategoryId, setSelectedChildCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState(""); // ✅ Added
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalImeis, setModalImeis] = useState(null);

  const perPage = 6;

  /* ================= AUTO SELECT FIRST CATEGORY ================= */
  useEffect(() => {
    if (categories.length && !selectedCategoryId) {
      setSelectedCategoryId(categories[0]._id);
    }
  }, [categories, selectedCategoryId]);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategoryId,
    selectedSubCategoryId,
    selectedChildCategoryId,
    selectedBrandId,
    search
  ]);

 

  /* ================= BUILD ROWS ================= */
  const rows = useMemo(() => {
    return inventory
      .map((inv) => {
const product = products.find(
  (p) => String(p._id) === String(inv.productId?._id || inv.productId)
);
        if (!product) return null;

        if (selectedCategoryId &&
          String(product.categoryId) !== String(selectedCategoryId)) return null;

        if (selectedSubCategoryId &&
          String(product.subCategoryId) !== String(selectedSubCategoryId)) return null;

        if (selectedChildCategoryId &&
          String(product.childCategoryId) !== String(selectedChildCategoryId)) return null;

        if (selectedBrandId &&
          String(product.brandId) !== String(selectedBrandId)) return null;

        const brand = brands.find(
          (b) => String(b._id) === String(product.brandId)
        );

        return {
          productName: product.name,
skuLabel: inv.skuId?.skuCode || "—",
          brand: brand?.name || "-",
          trackingType: product.trackingType,
          qty: Number(inv.qty || 0),
          imeis: inv.imeis || []
        };
      })
      .filter(Boolean)
      .filter((row) =>
        row.productName.toLowerCase().includes(search.toLowerCase())
      );
  }, [
    inventory,
    products,
    brands,
    selectedCategoryId,
    selectedSubCategoryId,
    selectedChildCategoryId,
    selectedBrandId,
    search
  ]);

  const paginatedRows = rows.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalUnits = rows.reduce((sum, r) => sum + r.qty, 0);
  const lowStockCount = rows.filter((r) => r.qty > 0 && r.qty <= 2).length;

  return (
    <div className="inventory-container">
      <h2>📦 Inventory</h2>

      {/* ================= STATS ================= */}
      <div className="stat-cards">
        <div className="stat-card blue">
          <div>Total Items</div>
          <h2>{rows.length}</h2>
        </div>
        <div className="stat-card dark">
          <div>Total Units</div>
          <h2>{totalUnits}</h2>
        </div>
        <div className="stat-card red">
          <div>Low Stock</div>
          <h2>{lowStockCount}</h2>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="inventory-filters">

        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setSelectedSubCategoryId("");
            setSelectedChildCategoryId("");
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedBrandId}
          onChange={(e) => setSelectedBrandId(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubCategoryId}
          onChange={(e) => {
            setSelectedSubCategoryId(e.target.value);
            setSelectedChildCategoryId("");
          }}
        >
          <option value="">All SubCategories</option>
          {subCategories
            .filter(sc => sc.categoryId === selectedCategoryId)
            .map((sc) => (
              <option key={sc._id} value={sc._id}>
                {sc.name}
              </option>
            ))}
        </select>

        <select
          value={selectedChildCategoryId}
          onChange={(e) => setSelectedChildCategoryId(e.target.value)}
        >
          <option value="">All ChildCategories</option>
          {childCategories
            .filter(cc => cc.subCategoryId === selectedSubCategoryId)
            .map((cc) => (
              <option key={cc._id} value={cc._id}>
                {cc.name}
              </option>
            ))}
        </select>

      </div>

      {/* ================= TABLE ================= */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Brand</th>
            <th>Tracking</th>
            <th>Qty</th>
            <th>IMEI</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, i) => (
            <tr
              key={i}
              className={row.qty > 0 && row.qty <= 2 ? "low-stock" : ""}
            >
              <td>{row.productName}</td>
              <td>{row.skuLabel}</td>
              <td>{row.brand}</td>
              <td>{row.trackingType}</td>
              <td>{row.qty}</td>
              <td>
                {row.trackingType === "IMEI" && row.imeis.length ? (
                  <div className="imei-container">
                    {row.imeis.slice(0, 2).map((imei, idx) => (
                      <span key={idx} className="imei-badge">
                        {imei}
                      </span>
                    ))}
                    {row.imeis.length > 2 && (
                      <span
                        className="imei-badge clickable"
                        onClick={() => setModalImeis(row.imeis)}
                      >
                        +{row.imeis.length - 2} more
                      </span>
                    )}
                  </div>
                ) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">
        {Array.from({
          length: Math.ceil(rows.length / perPage)
        }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "active-page" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ================= IMEI MODAL ================= */}
      {modalImeis && (
        <div className="modal-overlay" onClick={() => setModalImeis(null)}>
          <div className="modal-box">
            <h3>All IMEIs</h3>
            {modalImeis.map((imei, i) => (
              <div key={i}>{imei}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}