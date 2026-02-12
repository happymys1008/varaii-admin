import { useEffect, useState } from "react";

const STORAGE_KEY = "payment_settings";

export default function PaymentSettings() {
  // ✅ Hooks ALWAYS on top
  const [settings, setSettings] = useState({
    cod: {
      enabled: true,
      maxAmount: 5000
    },
    online: {
      enabled: true
    }
  });

  // ✅ useEffect NOT conditional
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
    alert("Payment settings saved successfully");
  };

  // ✅ return ALWAYS after hooks
  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>💳 Payment Settings</h2>

      <p style={{ color: "#666" }}>
        These are global payment rules.
        Pincode rules are managed separately.
      </p>

      <hr />

      {/* COD */}
      <h3>Cash on Delivery (COD)</h3>

      <label>
        <input
          type="checkbox"
          checked={settings.cod.enabled}
          onChange={(e) =>
            setSettings({
              ...settings,
              cod: {
                ...settings.cod,
                enabled: e.target.checked
              }
            })
          }
        />{" "}
        Enable COD
      </label>

      {settings.cod.enabled && (
        <div style={{ marginTop: 10 }}>
          <label>COD Max Amount</label>
          <input
            type="number"
            value={settings.cod.maxAmount}
            onChange={(e) =>
              setSettings({
                ...settings,
                cod: {
                  ...settings.cod,
                  maxAmount: Number(e.target.value)
                }
              })
            }
            style={{ width: "100%", marginTop: 4 }}
          />
        </div>
      )}

      <hr />

      {/* ONLINE */}
      <h3>Online Payment</h3>

      <label>
        <input
          type="checkbox"
          checked={settings.online.enabled}
          onChange={(e) =>
            setSettings({
              ...settings,
              online: {
                enabled: e.target.checked
              }
            })
          }
        />{" "}
        Enable Online Payment
      </label>

      <br />
      <br />

      <button onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
}