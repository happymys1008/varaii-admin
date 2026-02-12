import { Routes, Route, Navigate } from "react-router-dom";
import AdminApp from "./admin/pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}
