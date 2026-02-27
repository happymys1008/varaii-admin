import { useState } from "react";
import api from "../../../core/api/api";

export default function DeliveryRuleEditModal({
  rule,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    deliveryDays: rule.deliveryDays,
    shippingCharge: rule.shippingCharge,
    freeDeliveryAbove: rule.freeDeliveryAbove,
    codAvailable: rule.codAvailable,
    codAllowedAbove: rule.codAllowedAbove,
  });

  const save = async () => {
    await api.put(`/delivery/${rule._id}`, {
      deliveryDays: Number(form.deliveryDays),
      shippingCharge: Number(form.shippingCharge),
      freeDeliveryAbove: Number(form.freeDeliveryAbove),
      codAvailable: form.codAvailable,
      codAllowedAbove: Number(form.codAllowedAbove),
    });

    onSaved();
    onClose();
  };

  return (
    <div style={{ padding: 20, background: "#fff", border: "1px solid #ccc" }}>
      <h3>Edit Delivery Rule</h3>

      <input
        type="number"
        placeholder="Delivery Days"
        value={form.deliveryDays}
        onChange={(e) =>
          setForm({ ...form, deliveryDays: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Shipping ₹"
        value={form.shippingCharge}
        onChange={(e) =>
          setForm({ ...form, shippingCharge: e.target.value })
        }
      />

      <label>
        COD Available
        <input
          type="checkbox"
          checked={form.codAvailable}
          onChange={(e) =>
            setForm({ ...form, codAvailable: e.target.checked })
          }
        />
      </label>

      <div style={{ marginTop: 10 }}>
        <button onClick={save}>💾 Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}