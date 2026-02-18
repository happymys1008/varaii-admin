import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerService } from "../../services/customerService";

export default function CustomersDashboard() {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    isActive: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const list = await customerService.getAllCustomers();

        // 🔍 FILTERS (SAFE)
        const filtered = list.filter(c => {
          if (
            filters.city &&
            !c.city?.toLowerCase().includes(filters.city.toLowerCase())
          ) {
            return false;
          }

          if (
            filters.state &&
            !c.state?.toLowerCase().includes(filters.state.toLowerCase())
          ) {
            return false;
          }

          if (filters.isActive !== "") {
            if (String(c.isActive) !== filters.isActive) {
              return false;
            }
          }

          return true;
        });

        setCustomers(filtered);
      } catch (err) {
        console.error("Failed to load customers", err);
        setCustomers([]);
      }
    }

    load();
  }, [filters]);

  return (
    <div>
      <h2>Customers</h2>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <input
          placeholder="City"
          onChange={e =>
            setFilters(f => ({ ...f, city: e.target.value }))
          }
        />
        <input
          placeholder="State"
          onChange={e =>
            setFilters(f => ({ ...f, state: e.target.value }))
          }
        />
        <select
          onChange={e =>
            setFilters(f => ({ ...f, isActive: e.target.value }))
          }
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Blocked</option>
        </select>
      </div>

      {/* TABLE */}
      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>State</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c._id}>
              <td>{c.name || "-"}</td>
              <td>{c.mobile || c.phone || "-"}</td>
<td>
  {c.addresses && c.addresses.length > 0
    ? c.addresses[0].city || "-"
    : "-"}
</td>

<td>
  {c.addresses && c.addresses.length > 0
    ? c.addresses[0].state || "-"
    : "-"}
</td>

              <td>{c.isActive ? "Active" : "Blocked"}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/admin/customers/${c._id}`)
                  }
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!customers.length && <p>No customers found</p>}
    </div>
  );
}
