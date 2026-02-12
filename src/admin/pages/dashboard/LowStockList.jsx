import "./Dashboard.css";

const buildVariantLabel = (variant) => {
  if (!variant?.attributes) return "";
  const parts = Object.values(variant.attributes).filter(Boolean);
  return parts.length ? parts.join(" / ") : "";
};

export default function LowStockList({
  items = [],
  products = [],
  variants = [],
  onViewAll,
}) {

  const lowItems = items.slice(0, 5);

  if (lowItems.length === 0) return null;

  return (
    <div className="low-stock-list-card">
      <h4>⚠️ Low Stock Items</h4>

      {lowItems.map(v => {
        const product = products.find(
          p => String(p.id) === String(v.productId)
        );

        const productName = product?.name || "Unknown Product";
        const variant =
          variants.find((pv) => String(pv.id) === String(v.variantId)) || null;
        const variantLabel =
          buildVariantLabel(variant) ||
          (v.variantId ? `Variant: ${v.variantId}` : "");

        return (
          <div
            key={v.variantId}
            className="low-stock-row"
            onClick={() => onViewAll?.()}
          >
            <div>
              <strong>{productName}</strong>
              <div className="muted">
                {variantLabel}
                <br />
                {`Qty left: ${v.qty}`}
              </div>
            </div>

            <span className="danger-badge">LOW</span>
          </div>
        );
      })}

      <button
        className="low-stock-view"
        onClick={() => onViewAll?.()}
      >
        View all
      </button>
    </div>
  );
}
