import { useEffect, useState } from "react";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(filters).toString();

      const res = await API.get(`/admin/stores?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏪 Stores</h1>
        <LogoutButton />
      </div>

      <div className="flex gap-3 mb-4">
        <input
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={filters.email}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="address"
          placeholder="Address"
          value={filters.address}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          onClick={fetchStores}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-100">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.email}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{Number(store.rating).toFixed(1)} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStores;
