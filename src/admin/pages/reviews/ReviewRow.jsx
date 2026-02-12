export default function ReviewRow({
  review,
  onApprove,
  onReject,
  onDelete
}) {
  const id = review._id;

  /* ================= SAFE DATA ================= */
  const productName =
    review.product?.name ||
    review.productName ||
    "Unknown Product";

  const customerName =
    review.user?.name ||
    review.user?.mobile ||
    "Guest";

  return (
    <tr>
      <td>
        <strong>{productName}</strong>
      </td>

      <td>{customerName}</td>

      <td>⭐ {review.rating}</td>

      <td>{review.comment}</td>

      <td>
        <span className={`status ${review.status}`}>
          {review.status}
        </span>
      </td>

      <td>
        {review.status !== "approved" && (
          <button
            className="approve"
            onClick={() => onApprove(id)}
          >
            Approve
          </button>
        )}

        {review.status !== "rejected" && (
          <button
            className="reject"
            onClick={() => onReject(id)}
          >
            Reject
          </button>
        )}

        {review.status === "approved" && (
          <button
            className="delete"
            onClick={() => onDelete(id)}
            style={{
              marginLeft: 6,
              background: "#dc3545",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}
