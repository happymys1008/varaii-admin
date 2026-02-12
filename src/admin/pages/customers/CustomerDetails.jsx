import { useParams } from "react-router-dom";
import CustomerProfile from "./CustomerProfile";
import CustomerAddresses from "./CustomerAddresses";
import CustomerOrders from "./CustomerOrders";

export default function CustomerDetails() {
  const { id } = useParams();

  // 🔒 SAFETY GUARD
  if (!id) {
    return <p style={{ color: "red" }}>Invalid customer</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Customer Details</h2>

      {/* 👤 PROFILE */}
      <CustomerProfile customerId={id} />
      <hr />

      {/* 🏠 ADDRESSES */}
      <CustomerAddresses customerId={id} />
      <hr />

      {/* 📦 ORDERS */}
      <CustomerOrders customerId={id} />
    </div>
  );
}
