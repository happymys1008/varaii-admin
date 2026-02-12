import api from "./api";

/* ===============================
   🚀 PRODUCTS (CATALOG READ)
=============================== */

export const fetchProducts = (params = {}) =>
  api.get("/products", { params });

/* ===============================
   🗂 MASTER DATA (ADMIN DRIVEN)
=============================== */

export const fetchCategories = () =>
  api.get("/categories");

export const fetchSubCategories = () =>
  api.get("/sub-categories");

export const fetchChildCategories = () =>
  api.get("/child-categories");

export const fetchBrands = () =>
  api.get("/brands");

/* ===============================
   📦 INVENTORY (READ ONLY)
=============================== */

export const fetchInventory = () =>
  api.get("/inventory");

/* ===============================
   ⚡ BOOTSTRAP (SINGLE SOURCE)
=============================== */

export const fetchBootstrap = () =>
  api.get("/app/bootstrap");
