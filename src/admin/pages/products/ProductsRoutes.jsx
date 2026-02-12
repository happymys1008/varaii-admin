import { Routes, Route } from "react-router-dom";

import ProductsPage from "./index";
import ProductEditor from "./ProductEditor";
import ProductVariants from "./ProductVariants";
import ProductView from "../catalog/ProductView";

export default function ProductsRoutes() {
  return (
    <Routes>
      {/* 📦 LIST (INDEX ROUTE — FIXED) */}
      <Route index element={<ProductsPage />} />

      {/* ✏ EDIT */}
      <Route path=":id/edit" element={<ProductEditor />} />

      {/* 🧩 VARIANTS */}
      <Route path=":id/variants" element={<ProductVariants />} />

      {/* 👁 VIEW (LEGACY SAFE) */}
      <Route path=":id" element={<ProductView />} />
    </Routes>
  );
}
