import { useEffect, useState } from "react";
import api from "../../../core/api/api";


/*  SLUG MAKER */
const slugify = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [newChildCategoryName, setNewChildCategoryName] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  /* ================= LOAD ALL ================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
const cat = await api.get("/categories");
const sub = await api.get("/subcategories");
const child = await api.get("/childcategories");

        setCategories(cat.data);
        setSubCategories(sub.data);
        setChildCategories(child.data);
      } catch (err) {
        console.error("Failed loading categories", err);
      }
    };

    fetchAll();
  }, []);

  /* ================= ADD CATEGORY ================= */

  const addCategory = async () => {
    if (!newCategoryName.trim()) return alert("Enter category name");

    const cleaned = newCategoryName.trim().replace(/\s+/g, " ");
    const slug = slugify(cleaned);

    try {
      const res = await api.post("/categories", {
        name: cleaned,
        slug
      });

      setCategories(prev => [...prev, res.data]);
      setNewCategoryName("");
    } catch {
      alert("Error adding category");
    }
  };

  /* ================= ADD SUB CATEGORY ================= */

  const addSubCategory = async () => {
    if (!selectedCategoryId || !newSubCategoryName.trim())
      return alert("Select category & name");

    const cleaned = newSubCategoryName.trim().replace(/\s+/g, " ");

    const res = await api.post("/subcategories", {
      name: cleaned,
      slug: slugify(cleaned),
      categoryId: selectedCategoryId
    });

    setSubCategories(prev => [...prev, res.data]);
    setNewSubCategoryName("");
  };

  /* ================= ADD CHILD ================= */

  const addChildCategory = async () => {
    if (!selectedSubCategoryId || !newChildCategoryName.trim())
      return alert("Select sub category");

    const cleaned = newChildCategoryName.trim().replace(/\s+/g, " ");

   const res = await api.post("/childcategories", {
      name: cleaned,
      slug: slugify(cleaned),
      subCategoryId: selectedSubCategoryId
    });

    setChildCategories(prev => [...prev, res.data]);
    setNewChildCategoryName("");
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: 20 }}>
      <h2>📂 Categories</h2>

      <h4>Add Category</h4>
      <input
        value={newCategoryName}
        onChange={e => setNewCategoryName(e.target.value)}
      />
      <button onClick={addCategory}>Add</button>

      <hr />

      <h4>Add Sub Category</h4>
      <select onChange={e => setSelectedCategoryId(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <input
        value={newSubCategoryName}
        onChange={e => setNewSubCategoryName(e.target.value)}
      />
      <button onClick={addSubCategory}>Add</button>

      <hr />

      <h4>Add Product Type</h4>
      <select onChange={e => setSelectedSubCategoryId(e.target.value)}>
        <option value="">Select Sub Category</option>
        {subCategories.map(sc => (
          <option key={sc._id} value={sc._id}>{sc.name}</option>
        ))}
      </select>

      <input
        value={newChildCategoryName}
        onChange={e => setNewChildCategoryName(e.target.value)}
      />
      <button onClick={addChildCategory}>Add</button>

      <hr />

      {categories.map(cat => (
        <div key={cat._id} style={{ marginBottom: 12 }}>
          <b>{cat.name}</b>

          <ul>
            {subCategories
              .filter(sc => sc.categoryId?._id === cat._id || sc.categoryId === cat._id)
              .map(sc => (
                <li key={sc._id}>
                  {sc.name}

                  <ul>
                    {childCategories
                      .filter(cc => cc.subCategoryId?._id === sc._id || cc.subCategoryId === sc._id)
                      .map(cc => (
                        <li key={cc._id}>▸ {cc.name}</li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}