import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function StoresPage() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setStores(res.data);
    } catch (err) {
      console.error("Failed to load stores:", err);
      setError("Failed to fetch stores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    fetchStores();
  };

  if (loading) return <p className="p-6">Loading stores...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏬 Stores</h1>
        <LogoutButton />
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input placeholder="Name" name="name" value={filters.name} onChange={handleFilterChange} className="p-2 border rounded" />
        <input placeholder="Email" name="email" value={filters.email} onChange={handleFilterChange} className="p-2 border rounded" />
        <input placeholder="Address" name="address" value={filters.address} onChange={handleFilterChange} className="p-2 border rounded" />
        <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button>
      </div>

      {/* Stores Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Address</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id} className="cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/admin/stores/${s.id}`)}>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.address}</td>
                <td className="p-2">{Number(s.rating).toFixed(1)} ⭐</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StoresPage;
