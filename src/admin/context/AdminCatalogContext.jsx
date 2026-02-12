import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  fetchProducts,
  fetchCategories,
  fetchSubCategories,
  fetchChildCategories,
  fetchBrands
} from "../../core/api";

import api from "../../core/api/api";

const AdminCatalogContext = createContext(null);

/* 🔥 Safe response normalizer */
const normalize = res =>
  Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
    ? res.data
    : [];


export function AdminCatalogProvider({ children }) {

  /* ================= FLAGS ================= */
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ================= MASTER DATA ================= */
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  /* ================= PRODUCTS ================= */
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");

  /* ================= INVENTORY (ADMIN ONLY) ================= */
  const [variantInventory, setVariantInventory] = useState([]);

  /* ================= LOAD MASTER ================= */

  const loadCatalog = async () => {
    try {
      setIsRefreshing(true);

      const [catRes, subRes, childRes, brandRes] = await Promise.all([
        fetchCategories(),
        fetchSubCategories(),
        fetchChildCategories(),
        fetchBrands()
      ]);

      setCategories(normalize(catRes));
      setSubCategories(normalize(subRes));
      setChildCategories(normalize(childRes));
      setBrands(normalize(brandRes));

      setIsInitialLoad(false);
      setIsRefreshing(false);
    } catch (err) {
      console.error("Admin catalog load failed", err);
      setIsRefreshing(false);
    }
  };

  /* ================= LOAD PRODUCTS ================= */

  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
      const res = await fetchProducts({ page: 1, limit: 200 });
      setProducts(normalize(res));
    } catch (err) {
      setProducts([]);
      setProductsError(err.message || "Failed loading products");
    } finally {
      setProductsLoading(false);
    }
  };

  /* ================= LOAD INVENTORY (ADMIN API) ================= */

  const loadInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setVariantInventory(normalize(res));
    } catch {
      setVariantInventory([]);
    }
  };

  /* ================= INITIAL ================= */

  useEffect(() => {
    loadCatalog();
    loadProducts();
    loadInventory();
  }, []);

  /* ================= CATEGORY TREE ================= */

  const categoryTree = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      children: subCategories
        .filter(sub => String(sub.categoryId) === String(cat._id))
        .map(sub => ({
          ...sub,
          children: childCategories.filter(
            child => String(child.subCategoryId) === String(sub._id)
          )
        }))
    }));
  }, [categories, subCategories, childCategories]);

  /* ================= ADMIN PRODUCTS (RAW) ================= */

  const adminProducts = useMemo(() => {
    return products.map(p => ({
      ...p,
      id: p._id
    }));
  }, [products]);

  /* ================= CREATE PRODUCT ================= */

const createProduct = async payload => {
  try {
    const res = await api.post("/products", payload);

    // 🔴 SAFETY: backend must return product
    if (!res?.data?._id) {
      throw new Error("Product not created");
    }

    // ✅ INSTANT UI UPDATE (no dependency on reload)
    setProducts(prev => [res.data, ...prev]);

    // 🔁 Background refresh (optional)
    loadProducts().catch(() => {});
    loadInventory().catch(() => {});

    return res.data; // success
  } catch (err) {
    console.error("createProduct API failed:", err);
    throw err; // 🔥 VERY IMPORTANT
  }
};


  /* ================= CONTEXT ================= */

  return (
    <AdminCatalogContext.Provider
      value={{
        isInitialLoad,
        isRefreshing,

        categories,
        subCategories,
        childCategories,
        brands,
        categoryTree,

        products: adminProducts,
        productsLoading,
        productsError,

        variantInventory,
        inventory: variantInventory,

        reloadCatalog: loadCatalog,
        reloadProducts: loadProducts,
        reloadInventory: loadInventory,
        createProduct
      }}
    >
      {children}
    </AdminCatalogContext.Provider>
  );
}

export const useAdminCatalog = () => {
  const ctx = useContext(AdminCatalogContext);
  if (!ctx) {
    throw new Error("useAdminCatalog must be used inside AdminCatalogProvider");
  }
  return ctx;
};
