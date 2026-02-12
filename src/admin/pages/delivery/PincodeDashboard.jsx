import { useEffect, useState } from "react";
import {
  getPincodes,
  addOrUpdatePincode,
  deletePincode
} from "../../../utils/pincodeService";


import { lookupPincode } from "../../../utils/pincodeLookup";


const emptyForm = {
  pincode: "",
  city: "",
  state: "",
  deliveryDays: "",
  shippingCharge: "",
  codAvailable: true,
  deliveryAvailable: true
};

export default function PincodeDashboard() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setList(getPincodes());
  };

  useEffect(() => {
    load();
  }, []);

  const save = () => {
    if (!form.pincode || !form.city || !form.state) {
      alert("Pincode, City, State required");
      return;
    }

    addOrUpdatePincode(form);
    setForm(emptyForm);
    load();
  };

  const editRow = (row) => {
    setForm(row);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Pincode Delivery Manager</h2>

      {/* FORM */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
<input
  placeholder="Pincode"
  value={form.pincode}
  onChange={async e => {
    const pin = e.target.value.replace(/\D/g, "");
    setForm({ ...form, pincode: pin });

    if (pin.length === 6) {
      const info = await lookupPincode(pin);

      if (info) {
        setForm(f => ({
          ...f,
          pincode: pin,
          city: info.city,
          state: info.state
        }));
      }
    }
  }}
  style={{
    border: form.city && form.state ? "2px solid #22c55e" : "1px solid #ccc",
    outline: "none"
  }}
/>


<input
  placeholder="City"
  value={form.city}
  onChange={e => setForm({ ...form, city: e.target.value })}
  style={{
    background: form.city ? "#ecfdf5" : "white",
    border: "1px solid #ccc"
  }}
/>


<input
  placeholder="State"
  value={form.state}
  onChange={e => setForm({ ...form, state: e.target.value })}
  style={{
    background: form.state ? "#ecfdf5" : "white",
    border: "1px solid #ccc"
  }}
/>

        <input
          type="number"
          placeholder="Delivery Days"
          value={form.deliveryDays}
          onChange={e => setForm({ ...form, deliveryDays: e.target.value })}
        />

        <input
          type="number"
          placeholder="Shipping Charge"
          value={form.shippingCharge}
          onChange={e => setForm({ ...form, shippingCharge: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.codAvailable}
            onChange={e => setForm({ ...form, codAvailable: e.target.checked })}
          />
          COD Available
        </label>

        <button onClick={save}>Save / Update</button>
      </div>

      {/* TABLE */}
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Pincode</th>
            <th>City</th>
            <th>State</th>
            <th>Days</th>
            <th>Charge</th>
            <th>COD</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {list.length === 0 && (
            <tr>
              <td colSpan="7" align="center">No pincodes added</td>
            </tr>
          )}

          {list.map(p => (
            <tr key={p.pincode}>
              <td>{p.pincode}</td>
              <td>{p.city}</td>
              <td>{p.state}</td>
              <td>{p.deliveryDays}</td>
              <td>₹{p.shippingCharge}</td>
              <td>{p.codAvailable ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => editRow(p)}>Edit</button>
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    deletePincode(p.pincode);
                    load();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
