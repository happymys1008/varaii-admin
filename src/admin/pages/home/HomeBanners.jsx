import { useEffect, useState } from "react";
import api from "../../../core/api/api";

export default function HomeBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD BANNERS ================= */
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const res = await api.get("/home-banners");
    setBanners(res.data || []);
  };

  /* ================= ADD BANNER ================= */
  const addBanner = async () => {
    if (!file) {
      alert("Image required");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("order", order);

    try {
      setLoading(true);
      await api.post("/home-banners", formData);

      setFile(null);
      setTitle("");
      setOrder(banners.length + 1);

      await loadBanners();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE ACTIVE ================= */
  const toggleActive = async (id) => {
    try {
      await api.patch(`/admin/home-banners/${id}/toggle`);
      loadBanners();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  /* ================= DELETE BANNER ================= */
  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner permanently?")) return;

    try {
      await api.delete(`/home-banners/${id}`);
      loadBanners();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🖼️ Home Banners</h2>

      <div className="card">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          placeholder="Title / Link (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />

        <button onClick={addBanner} disabled={loading}>
          {loading ? "Uploading..." : "➕ Add Banner"}
        </button>
      </div>

      <table className="table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Preview</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {banners.map((b) => (
            <tr key={b._id}>
              <td>{b.order}</td>

              <td>
                <img
                  src={b.imageUrl}
                  alt=""
                  style={{ width: 160, borderRadius: 6 }}
                />
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={b.active}
                  onChange={() => toggleActive(b._id)}
                />
              </td>

              <td>
                <button
                  onClick={() => deleteBanner(b._id)}
                  style={{ color: "red" }}
                >
                  🗑 Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
