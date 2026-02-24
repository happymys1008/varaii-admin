import { useNavigate } from "react-router-dom";

export default function ProductList({ products = [], inventory = [] }) {
  const navigate = useNavigate();

  if (!products.length) {
    return (
      <div style={{ marginTop: 20, opacity: 0.6 }}>
        No products found
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20, background: "#fff", borderRadius: 10 }}>
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 2fr",
          padding: 10,
          fontWeight: "bold",
          background: "#f1f3f5",
          borderRadius: "10px 10px 0 0"
        }}
      >
        <div>Product</div>
        <div>Type</div>
        <div>Stock</div>
        <div>Actions</div>
      </div>

      {/* ROWS */}
      {products.map((p) => {
const qty = inventory
  .filter(i => {
    if (!i || !i.productId) return false;

    const invProductId =
      typeof i.productId === "object" && i.productId !== null
        ? i.productId._id
        : i.productId;

    return String(invProductId) === String(p._id);
  })
  .reduce((sum, i) => sum + Number(i.qty || 0), 0);


        return (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 2fr",
              padding: 10,
              borderTop: "1px solid #eee",
              alignItems: "center",
              background:
                qty === 0
                  ? "#ffecec"
                  : qty <= 3
                  ? "#fff4e5"
                  : "transparent"
            }}
          >
            {/* PRODUCT NAME */}
            <div>{p.name}</div>

            {/* PRODUCT TYPE (LOCKED TRUTH) */}
            <div>
              {p.trackingType === "IMEI"
                ? "Mobile"
                : p.trackingType === "SERIAL"
                ? "Serial Item"
                : "Qty Item"}
            </div>

            {/* STOCK */}
            <div
              style={{
                fontWeight: 600,
                color:
                  qty === 0
                    ? "red"
                    : qty <= 3
                    ? "orange"
                    : "green"
              }}
            >
              {qty}
            </div>

{/* ACTIONS */}
<div style={{ display: "flex", gap: 8 }}>
  {/* 👁 VIEW (OLD SAFE FLOW) */}
  <button
    onClick={() =>
      navigate(`/admin/products/${p.id}`)
    }
  >
    View
  </button>

  {/* ✏ EDIT (NEW PRODUCT EDITOR) */}
  <button
    onClick={() =>
      navigate(`/admin/products/${p.id}/edit`)
    }
  >
    Edit
  </button>

  {/* 🧩 VARIANTS */}
  {p.hasVariants && (
<button
  onClick={() =>
    navigate(
      `/admin/products/${p.id}/variants`,
      {
        state: {
          productName: p.name
        }
      }
    )
  }
>
  Manage Variants
</button>

  )}
</div>


          </div>
        );
      })}
    </div>
  );
}
