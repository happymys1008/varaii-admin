import { useEffect, useState } from "react";
import ReviewRow from "./ReviewRow";
import {
  getAllReviews,
  updateReviewStatus,
  deleteReview
} from "../../services/reviewService";

export default function ReviewsDashboard() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  /* ================= LOAD REVIEWS ================= */
  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= ACTIONS ================= */
  const handleApprove = async (id) => {
    await updateReviewStatus(id, "approved");
    load();
  };

  const handleReject = async (id) => {
    await updateReviewStatus(id, "rejected");
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;

    await deleteReview(id);
    load();
  };

  const filtered = reviews.filter(r => r.status === filter);

  return (
    <div>
      <h2>⭐ Product Reviews</h2>

      <div style={{ marginBottom: 12 }}>
        {["pending", "approved", "rejected"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              marginRight: 8,
              background: filter === s ? "#0b5ed7" : "#eee",
              color: filter === s ? "white" : "black",
              padding: "6px 12px",
              borderRadius: 6
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <table className="review-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(r => (
              <ReviewRow
                key={r._id}
                review={r}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", opacity: 0.6 }}>
                  No reviews here
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
