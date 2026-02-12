import { useEffect, useState } from "react";
import api from "../../../core/api/api";
import "../../styles/homeBanners.css";

export default function HomeBanners() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const res = await api.get("/home-banners");
    setBanners(res.data || []);
  };

  /* ================= ADD ================= */
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
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id) => {
    await api.patch(`/admin/home-banners/${id}/toggle`);
    loadBanners();
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner permanently?")) return;
    await api.delete(`/home-banners/${id}`);
    loadBanners();
  };

  return (
    <div className="hb-container">
      <h2 className="hb-title">🖼️ Home Banners</h2>

      {/* Upload Section */}
      <div className="hb-card">
        <div className="hb-form-grid">
          <div className="hb-field">
            <label>Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="hb-field">
            <label>Title / Link (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="hb-field small">
            <label>Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>

          <div className="hb-button-wrap">
            <button onClick={addBanner} disabled={loading}>
              {loading ? "Uploading..." : "➕ Add Banner"}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="hb-table-wrapper">
        <table className="hb-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Preview</th>
              <th>Status</th>
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
                    className="hb-preview"
                  />
                </td>

                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={b.active}
                      onChange={() => toggleActive(b._id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>

                <td>
                  <button
                    className="hb-delete-btn"
                    onClick={() => deleteBanner(b._id)}
                  >
                    🗑 Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
