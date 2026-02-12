// ===== CART =====
export const getCartKey = (userId) => {
  return userId ? `cart_${userId}` : "cart_guest";
};

// ===== GENERIC STORAGE =====
export const readStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// ===== PURCHASE STORAGE KEYS =====
export const PURCHASES_KEY = "purchases";
export const PURCHASE_ITEMS_KEY = "purchase_items";

// ===== PURCHASE READ HELPERS =====
export const getPurchases = () =>
  readStorage(PURCHASES_KEY, []);

export const getPurchaseItems = () =>
  readStorage(PURCHASE_ITEMS_KEY, []);
