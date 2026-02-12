export default function ProductsDashboard({
  products = [],
  inventorySummary = [],
  activeFilter = "ALL",
  onFilterChange = () => {}
}) {
  const totalProducts = products.length;

  const lowStockCount = inventorySummary.filter(
    i => i.isLowStock
  ).length;

  const outOfStockCount = inventorySummary.filter(
    i => i.isOutOfStock
  ).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: 24
      }}
    >
      <Card
        title="Total Products"
        value={totalProducts}
        active={activeFilter === "ALL"}
        onClick={() => onFilterChange("ALL")}
        color="#0d6efd"
      />

      <Card
        title="Low Stock"
        value={lowStockCount}
        active={activeFilter === "LOW_STOCK"}
        onClick={() => onFilterChange("LOW_STOCK")}
        color="#fd7e14"
      />

      <Card
        title="Out of Stock"
        value={outOfStockCount}
        active={activeFilter === "OUT_OF_STOCK"}
        onClick={() => onFilterChange("OUT_OF_STOCK")}
        color="#dc3545"
      />
    </div>
  );
}

/* 👇👇 YE COMPONENT ADD KARNA HI MISSING THA */
function Card({ title, value, color, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        background: active ? color : "#111827",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        borderLeft: `6px solid ${color}`,
        boxShadow: active
          ? "0 0 0 2px rgba(255,255,255,0.3)"
          : "0 4px 12px rgba(0,0,0,0.2)"
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}
