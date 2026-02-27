import { useEffect, useState } from "react";
import api from "../../../core/api/api";
import { lookupPincode } from "../../../utils/pincodeLookup";
import DeliveryRuleEditModal from "./DeliveryRuleEditModal";

const STATE_OPTIONS = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CT", name: "Chhattisgarh" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "PB", name: "Punjab" },
  { code: "RJ", name: "Rajasthan" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "WB", name: "West Bengal" },
];

export default function PincodeDashboard() {
  const [rules, setRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [activeTab, setActiveTab] = useState("PINCODE");

  const [form, setForm] = useState({
    type: "PINCODE",
    value: "",
    area: "",
    city: "",
    stateName: "",
    deliveryDays: "",
    shippingCharge: "",
    freeDeliveryAbove: "",
    codAvailable: true,
  });



  useEffect(() => {
    load();
  }, []);

/* ================= LOAD RULES ================= */

const load = async () => {
  const res = await api.get("/delivery");

  const sorted = (res.data || []).sort((a, b) => {
    const order = {
      GLOBAL: 1,
      STATE: 2,
      PINCODE: 3,
    };

    // Type priority sorting
    if (order[a.type] !== order[b.type]) {
      return order[a.type] - order[b.type];
    }

    // Same type sorting
    if (a.type === "STATE") {
      return (a.value || "").localeCompare(b.value || "");
    }

    if (a.type === "PINCODE") {
      return Number(a.value) - Number(b.value);
    }

    return 0;
  });

  setRules(sorted);
};

  /* ================= PINCODE AUTO FETCH ================= */

  const handlePincodeChange = async (pin) => {
    const cleanPin = pin.replace(/\D/g, "").slice(0, 6);

    setForm(prev => ({
      ...prev,
      value: cleanPin,
    }));

    if (cleanPin.length === 6) {
      const info = await lookupPincode(cleanPin);

      if (info) {
        setForm(prev => ({
          ...prev,
          value: cleanPin,
          area: info.area || "",
          city: info.city || "",
          stateName: info.state || "",
        }));
      }
    }
  };

  /* ================= ADD RULE ================= */

  const addRule = async () => {
    if (!form.deliveryDays)
      return alert("Delivery Days required");

    if (form.type === "PINCODE" && form.value.length !== 6)
      return alert("Valid 6 digit pincode required");

    if (form.type === "STATE" && !form.value)
      return alert("Select state");

    if (form.type === "GLOBAL") {
      const alreadyGlobal = rules.find(
        r => r.type === "GLOBAL"
      );
      if (alreadyGlobal)
        return alert("Only one GLOBAL rule allowed");
    }

    await api.post("/delivery", {
      type: form.type,
      value:
        form.type === "GLOBAL"
          ? null
          : form.value?.trim(),
      area: form.area,
      city: form.city,
      stateName: form.stateName,
      deliveryDays: Number(form.deliveryDays),
      shippingCharge: Number(form.shippingCharge || 0),
      freeDeliveryAbove: Number(
        form.freeDeliveryAbove || 0
      ),
      codAvailable: form.codAvailable,
    });

    resetForm();
    load();
  };

  const resetForm = () => {
    setForm({
      type: activeTab,
      value: "",
      area: "",
      city: "",
      stateName: "",
      deliveryDays: "",
      shippingCharge: "",
      freeDeliveryAbove: "",
      codAvailable: true,
    });
  };

  /* ================= DELETE ================= */

  const deleteRule = async (id) => {
    if (!window.confirm("Delete this rule?"))
      return;
    await api.delete(`/delivery/${id}`);
    load();
  };



  /* ================= UI ================= */

  return (
    <div style={{ padding: 20 }}>
      <h2>🚚 Delivery Rule Manager</h2>

      {/* ===== TABS ===== */}
      <div style={{ marginBottom: 20 }}>
        {["GLOBAL", "STATE", "PINCODE"].map(
          tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setForm(prev => ({
                  ...prev,
                  type: tab,
                }));
              }}
              style={{
                marginRight: 10,
                background:
                  activeTab === tab
                    ? "#000"
                    : "#ccc",
                color: "#fff",
              }}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* ===== ADD FORM ===== */}
      <div
        style={{
          marginBottom: 30,
          border: "1px solid #ddd",
          padding: 15,
        }}
      >
        <h3>Add {activeTab} Rule</h3>

        {activeTab === "PINCODE" && (
          <>
            <input
              placeholder="6 Digit Pincode"
              value={form.value}
              onChange={(e) =>
                handlePincodeChange(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Area"
              value={form.area}
              readOnly
            />
            <input
              placeholder="City"
              value={form.city}
              readOnly
            />
            <input
              placeholder="State"
              value={form.stateName}
              readOnly
            />
          </>
        )}

        {activeTab === "STATE" && (
          <select
            value={form.value}
            onChange={(e) =>
              setForm({
                ...form,
                value: e.target.value,
              })
            }
          >
            <option value="">
              Select State
            </option>
            {STATE_OPTIONS.map(s => (
              <option
                key={s.code}
                value={s.code}
              >
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Delivery Days"
          value={form.deliveryDays}
          onChange={(e) =>
            setForm({
              ...form,
              deliveryDays: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Shipping ₹"
          value={form.shippingCharge}
          onChange={(e) =>
            setForm({
              ...form,
              shippingCharge:
                e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Free Delivery Above ₹"
          value={form.freeDeliveryAbove}
          onChange={(e) =>
            setForm({
              ...form,
              freeDeliveryAbove:
                e.target.value,
            })
          }
        />

        <label>
          COD Available
          <input
            type="checkbox"
            checked={form.codAvailable}
            onChange={(e) =>
              setForm({
                ...form,
                codAvailable:
                  e.target.checked,
              })
            }
          />
        </label>

        <br />
        <button onClick={addRule}>
          ➕ Add Rule
        </button>
      </div>

      {/* ===== RULE LIST ===== */}
      <h3>Existing Rules</h3>

      {rules.map(r => (
<div
  key={r._id}
  style={{
    padding: 15,
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    marginBottom: 15,
    background: "#fff",
  }}
>
  {/* TYPE HEADER */}
  <div style={{ fontWeight: 600, marginBottom: 8 }}>
    {r.type === "GLOBAL" && "🌍 GLOBAL RULE"}
    {r.type === "STATE" && `🗺 STATE RULE (${r.value})`}
    {r.type === "PINCODE" && "📍 PINCODE RULE"}
  </div>

  {/* PINCODE STRUCTURED VIEW */}
{r.type === "PINCODE" && (
  <div
    style={{
      display: "flex",
      gap: 20,
      flexWrap: "wrap",
      marginBottom: 12,
      marginTop: 8,
    }}
  >
    <div
      style={{
        background: "#f3f6ff",
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #dce3ff",
        minWidth: 100,
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>
        PINCODE
      </div>
      <div style={{ fontWeight: 600 }}>
        {r.value}
      </div>
    </div>

    <div
      style={{
        background: "#f9f9f9",
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #eee",
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>
        AREA
      </div>
      <div style={{ fontWeight: 600 }}>
        {r.area || "-"}
      </div>
    </div>

    <div
      style={{
        background: "#f9f9f9",
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #eee",
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>
        CITY
      </div>
      <div style={{ fontWeight: 600 }}>
        {r.city || "-"}
      </div>
    </div>

    <div
      style={{
        background: "#f9f9f9",
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #eee",
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>
        STATE
      </div>
      <div style={{ fontWeight: 600 }}>
        {r.stateName || "-"}
      </div>
    </div>
  </div>
)}

  {/* COMMON INFO */}
  <div style={{ marginBottom: 6 }}>
    <strong>Delivery Days:</strong> {r.deliveryDays}
  </div>

  <div style={{ marginBottom: 6 }}>
    <strong>Shipping:</strong> ₹{r.shippingCharge}
  </div>

  <div style={{ marginBottom: 6 }}>
    <strong>Status:</strong>{" "}
    {r.isActive ? "Active" : "Inactive"}
  </div>

  <div style={{ marginTop: 10 }}>
    <button onClick={() => setEditingRule(r)}>✏ Edit</button>
    <button
      style={{ marginLeft: 10 }}
      onClick={() => deleteRule(r._id)}
    >
      🗑 Delete
    </button>
  </div>
</div>
      ))}

      {editingRule && (
        <DeliveryRuleEditModal
          rule={editingRule}
          onClose={() =>
            setEditingRule(null)
          }
          onSaved={load}
        />
      )}
    </div>
  );
}