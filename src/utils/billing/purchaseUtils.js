import {
  writeStorage,
  PURCHASES_KEY,
  PURCHASE_ITEMS_KEY,
  getPurchases,
  getPurchaseItems
} from "../../core/storage";

import api from "../../core/api/api";

/* ======================================
   SAVE PURCHASE + BACKEND STOCK ADD
====================================== */

export const savePurchase = async ({ purchase, items }) => {
  const purchases = getPurchases();
  const purchaseItems = getPurchaseItems();

  const purchaseId = purchase.id || `PUR-${Date.now()}`;

  /* ---------- PURCHASE HEADER ---------- */
  const purchaseRecord = {
    ...purchase,
    id: purchaseId,
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  };

  /* ---------- PURCHASE ITEMS ---------- */
  const itemRecords = items.map(item => ({
    ...item,
    purchaseId
  }));

  /* ---------- SAVE LOCAL REGISTER ---------- */
  writeStorage(PURCHASES_KEY, [...purchases, purchaseRecord]);
  writeStorage(PURCHASE_ITEMS_KEY, [...purchaseItems, ...itemRecords]);

  /* 🔥 BACKEND STOCK ADD (PRO WAY) */
  await api.post("/inventory/purchase-add", {
    purchaseId,
    items
  });

  return purchaseId;
};

/* ======================================
   GET PURCHASE REGISTER
====================================== */

export const getPurchaseRegister = () => {
  return getPurchases();
};

/* ======================================
   GET PURCHASE ITEMS
====================================== */

export const getItemsByPurchase = purchaseId => {
  return getPurchaseItems().filter(
    item => item.purchaseId === purchaseId
  );
};

/* ======================================
   DELETE PURCHASE + BACKEND STOCK REVERSE
====================================== */

export const deletePurchase = async purchaseId => {
  const purchases = getPurchases();
  const items = getPurchaseItems();

  const purchase = purchases.find(p => p.id === purchaseId);
  if (!purchase || purchase.status === "DELETED") return;

  const relatedItems = items.filter(i => i.purchaseId === purchaseId);

  /* 🔥 BACKEND STOCK REVERSE */
  await api.post("/inventory/purchase-reverse", {
    purchaseId,
    items: relatedItems
  });

  /* ---------- MARK DELETED ---------- */
  const updatedPurchases = purchases.map(p =>
    p.id === purchaseId
      ? { ...p, status: "DELETED" }
      : p
  );

  writeStorage(PURCHASES_KEY, updatedPurchases);
};
