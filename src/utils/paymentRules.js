// src/utils/paymentRules.js

import { getPincodeInfo } from "./pincodeService";

export function resolvePaymentOptions({
  cart,
  total,
  pincode
}) {
  // 1️⃣ Global payment settings (ADMIN)
  const paymentSettings =
    JSON.parse(localStorage.getItem("payment_settings")) || {};

  // 2️⃣ Pincode rules (ADMIN)
  const deliveryInfo = getPincodeInfo(pincode);

  // 3️⃣ Product-level rules (future ready)
  const cartAllowsCOD = cart.every(
    (i) => i.product?.paymentOptions?.cod !== false
  );

  const cartAllowsOnline = cart.every(
    (i) => i.product?.paymentOptions?.online !== false
  );

  // 4️⃣ FINAL DECISION (Flipkart-style)
  const allowCOD =
    paymentSettings?.cod?.enabled === true &&
    deliveryInfo?.codAvailable === true &&
    total <= (paymentSettings?.cod?.maxAmount || Infinity) &&
    cartAllowsCOD;

  const allowOnline =
    paymentSettings?.online?.enabled === true &&
    cartAllowsOnline;

  return {
    allowCOD,
    allowOnline,
    deliveryInfo
  };
}