import axios from "axios";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_BASE_URL_PROD
    : process.env.REACT_APP_API_BASE_URL;

export const createPurchaseApi = async (payload) => {
  const token = localStorage.getItem("adminToken"); // 🔥 IMPORTANT

  const res = await axios.post(
    `${API_BASE}/api/purchases`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};
