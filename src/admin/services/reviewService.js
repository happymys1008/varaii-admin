import api from "../../core/api/api";

/* ================= GET ALL REVIEWS ================= */
export const getAllReviews = async () => {
  const res = await api.get("/reviews");   // ✅ NOT /api/reviews
  return res.data;
};

/* ================= UPDATE STATUS ================= */
export const updateReviewStatus = async (id, status) => {
  const res = await api.patch(`/reviews/${id}`, { status });
  return res.data;
};

/* ================= DELETE REVIEW ================= */
export const deleteReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};
