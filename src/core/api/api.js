import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.varaii.com" // 🔒 HARD LOCK FOR PROD
    : process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ ONLY PLACE WHERE /api EXISTS
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
