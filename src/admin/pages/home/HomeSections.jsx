import { useEffect, useState } from "react";
import api from "../../../core/api/api";

export default function HomeSections() {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]); // main
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [form, setForm] = useState({
    title: "",
    categoryId: "", // FINAL childCategoryId
    limit: 8,
    order: 1,
    active: true
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

const [
  sectionRes,
  mainRes,
  subRes,
  childRes
] = await Promise.all([
  api.get("/home-sections"),
  api.get("/categories"),
  api.get("/sub-categories"),
  api.get("/child-categories")
]);


      // 🧪 DEBUG (ek baar dekh lena)
      console.log("MAIN:", mainRes.data);
      console.log("SUB:", subRes.data);
      console.log("CHILD:", childRes.data);

      setSections(sectionRes.data || []);
      setCategories(mainRes.data || []);
      setSubCategories(subRes.data || []);
      setChildCategories(childRes.data || []);
    } catch (err) {
      console.error("❌ HomeSections load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */
  const addSection = async () => {
    if (!form.title.trim() || !form.categoryId) return;

    try {
      const res = await api.post("/home-sections", form);

      setSections(prev =>
        [...prev, res.data].sort((a, b) => a.order - b.order)
      );

      setForm({
        title: "",
        categoryId: "",
        limit: 8,
        order: sections.length + 2,
        active: true
      });

      setSelectedMain("");
      setSelectedSub("");
    } catch (err) {
      console.error("❌ Add section failed", err);
    }
  };

  /* ================= DELETE ================= */
  const remove = async id => {
    if (!window.confirm("Delete this section?")) return;

    try {
      await api.delete(`/home-sections/${id}`);
      setSections(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error("❌ Delete failed", err);
    }
  };

  /* ================= TOGGLE ================= */
  const toggle = async section => {
    try {
      const updated = { ...section, active: !section.active };
      await api.put(`/home-sections/${section._id}`, updated);

      setSections(prev =>
        prev.map(s => (s._id === section._id ? updated : s))
      );
    } catch (err) {
      console.error("❌ Toggle failed", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🏠 Home Sections</h2>

      {/* ================= FORM ================= */}
      <div className="card" style={{ marginBottom: 20 }}>
        <input
          placeholder="Section Title"
          value={form.title}
          onChange={e =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* MAIN CATEGORY */}
        <select
          value={selectedMain}
          onChange={e => {
            setSelectedMain(e.target.value);
            setSelectedSub("");
            setForm({ ...form, categoryId: "" });
          }}
        >
          <option value="">Select Main Category</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUB CATEGORY */}
        <select
          value={selectedSub}
          disabled={!selectedMain}
          onChange={e => {
            setSelectedSub(e.target.value);
            setForm({ ...form, categoryId: "" });
          }}
        >
          <option value="">Select Sub Category</option>
          {subCategories
            .filter(s => String(s.categoryId) === String(selectedMain))
            .map(s => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
        </select>

        {/* CHILD CATEGORY */}
        <select
          value={form.categoryId}
          disabled={!selectedSub}
          onChange={e =>
            setForm({ ...form, categoryId: e.target.value })
          }
        >
          <option value="">Select Child Category</option>
          {childCategories
            .filter(
              c => String(c.subCategoryId) === String(selectedSub)
            )
            .map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>

        <input
          type="number"
          min={1}
          placeholder="Product Limit"
          value={form.limit}
          onChange={e =>
            setForm({ ...form, limit: Number(e.target.value) })
          }
        />

        <input
          type="number"
          min={1}
          placeholder="Order"
          value={form.order}
          onChange={e =>
            setForm({ ...form, order: Number(e.target.value) })
          }
        />

        <button onClick={addSection} disabled={!form.categoryId}>
          ➕ Add Section
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Category</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sections
              .sort((a, b) => a.order - b.order)
              .map(s => (
                <tr key={s._id}>
                  <td>{s.order}</td>
                  <td>{s.title}</td>
                  <td>
                    {childCategories.find(
                      c => String(c._id) === String(s.categoryId)
                    )?.name || "-"}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!s.active}
                      onChange={() => toggle(s)}
                    />
                  </td>
                  <td>
                    <button onClick={() => remove(s._id)}>❌</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
