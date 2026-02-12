import { useEffect, useState } from "react";
import { customerService } from "../../services/customerService";

export default function CustomerAddresses({ customerId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data =
          await customerService.getCustomerAddresses(customerId);
        setAddresses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load addresses", err);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [customerId]);

  if (loading) return <p>Loading addresses…</p>;

  if (!addresses.length) {
    return <p>No addresses found</p>;
  }

  return (
    <div>
      <h3>Addresses</h3>

      {addresses.map(addr => (
        <div
          key={addr._id}
          style={{
            border: "1px solid #ccc",
            margin: 8,
            padding: 8
          }}
        >
          <p>
            <b>
              {addr.name}
              {addr.phone ? ` (${addr.phone})` : ""}
            </b>
          </p>

          <p>
            {[addr.line1, addr.line2]
              .filter(Boolean)
              .join(", ")}
          </p>

          <p>
            {addr.city}, {addr.state} - {addr.pincode}
          </p>

          {addr.isDefault && (
            <p style={{ color: "blue" }}>(Default)</p>
          )}
        </div>
      ))}
    </div>
  );
}
