import { useEffect, useState } from "react";
import { customerService } from "../../services/customerService";
import { getProfileSchema } from "../../../utils/profileSchema";

export default function CustomerProfile({ customerId }) {
  const [customer, setCustomer] = useState(null);
  const [schema, setSchema] = useState({});

  // 🔐 Load schema (admin controlled)
  useEffect(() => {
    setSchema(getProfileSchema());
  }, []);

  // 🔥 Load customer from backend (single source of truth)
  useEffect(() => {
    if (!customerId) return;

    async function load() {
      try {
        const data = await customerService.getCustomerById(customerId);
        setCustomer(data);
      } catch (err) {
        console.error("Failed to load customer profile", err);
        setCustomer(null);
      }
    }

    load();
  }, [customerId]);

  if (!customer) return <p>Loading profile…</p>;

  return (
    <div>
      <h3>Customer Profile (View Only)</h3>

      {/* STATUS */}
      <p>
        Status:{" "}
        <b style={{ color: customer.isActive ? "green" : "red" }}>
          {customer.isActive ? "Active" : "Blocked"}
        </b>
      </p>

      <hr />

      {/* 👤 BASIC INFO (FROM BACKEND) */}
      {schema.firstName && (
        <p><b>First Name:</b> {customer.firstName || "-"}</p>
      )}

      {schema.lastName && (
        <p><b>Last Name:</b> {customer.lastName || "-"}</p>
      )}

      {schema.email && (
        <p><b>Email:</b> {customer.email || "-"}</p>
      )}

      {schema.phone && (
        <p><b>Phone:</b> {customer.phone || "-"}</p>
      )}

      {/* 🔮 FUTURE FIELDS (SAFE) */}
      {schema.dob && (
        <p><b>DOB:</b> {customer.dob || "-"}</p>
      )}

      {schema.anniversary && (
        <p><b>Anniversary:</b> {customer.anniversary || "-"}</p>
      )}

      <hr />

      {/* 🔒 ADMIN ACTION */}
      <button
        onClick={async () => {
          try {
            const updated = await customerService.updateCustomer(
              customerId,
              { isActive: !customer.isActive }
            );
            setCustomer(updated);
          } catch (err) {
            alert("Failed to update customer status");
          }
        }}
        style={{
          background: customer.isActive ? "#dc3545" : "#198754",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: 4
        }}
      >
        {customer.isActive ? "Block Customer" : "Unblock Customer"}
      </button>
    </div>
  );
}
