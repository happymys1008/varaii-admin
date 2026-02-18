import { useEffect, useState } from "react";
import { customerService } from "../../services/customerService";
import { getProfileSchema } from "../../../utils/profileSchema";

export default function CustomerProfile({ customerId }) {
  const [customer, setCustomer] = useState(null);
  const [schema, setSchema] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔐 LOAD SCHEMA (ADMIN CONTROLLED) */
  useEffect(() => {
    setSchema(getProfileSchema());
  }, []);

  /* 🔥 LOAD CUSTOMER (SINGLE SOURCE OF TRUTH) */
  useEffect(() => {
    if (!customerId) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data =
          await customerService.getCustomerById(customerId);

        setCustomer(data?.customer || data?.user || data);
      } catch (err) {
        console.error("Failed to load customer profile", err);
        setError(err.message || "Failed to load profile");
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [customerId]);

  /* ===== STATES ===== */
  if (loading) return <p>Loading profile…</p>;

  if (error)
    return <p style={{ color: "red" }}>{error}</p>;
/* 📅 FORMAT JOIN DATE */
const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};


  if (!customer)
    return <p>No customer profile found</p>;

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

      {/* 👤 BASIC INFO */}
      {schema.firstName && (
        <p>
          <b>First Name:</b>{" "}
          {customer.name?.split(" ")[0] || "-"}
        </p>
      )}

      {schema.lastName && (
        <p>
          <b>Last Name:</b>{" "}
          {customer.name?.split(" ").slice(1).join(" ") || "-"}
        </p>
      )}

      {schema.email && (
        <p>
          <b>Email:</b> {customer.email || "-"}
        </p>
      )}

      {schema.secondaryPhone && (
        <p>
          <b>Phone:</b> {customer.mobile || "-"}
        </p>
      )}

{/* 📅 JOIN DATE */}
<p>
  <b>Joined On:</b> {formatDate(customer.createdAt)}
</p>


      {/* 🔮 FUTURE FIELDS */}
      {schema.dob && (
        <p>
          <b>DOB:</b> {customer.dob || "-"}
        </p>
      )}

      {schema.anniversary && (
        <p>
          <b>Anniversary:</b> {customer.anniversary || "-"}
        </p>
      )}

      <hr />

      {/* 🔒 ADMIN ACTION */}
      <button
        onClick={async () => {
          try {
            const updated =
              await customerService.updateCustomer(
                customerId,
                { isActive: !customer.isActive }
              );

            setCustomer(
              updated?.customer || updated?.user || updated
            );
          } catch {
            alert("Failed to update customer status");
          }
        }}
        style={{
          background: customer.isActive
            ? "#dc3545"
            : "#198754",
          color: "white",
          padding: "6px 12px",
          border: "none",
          borderRadius: 4
        }}
      >
        {customer.isActive
          ? "Block Customer"
          : "Unblock Customer"}
      </button>
    </div>
  );
}
