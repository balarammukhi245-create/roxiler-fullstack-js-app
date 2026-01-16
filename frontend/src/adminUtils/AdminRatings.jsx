import { useEffect, useState } from "react";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function AdminRatings() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    store_name: "",
    user_name: "",
  });

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(filters).toString();

      const res = await API.get(`/admin/stores/ratings?${query}`,
         { headers: { Authorization: `Bearer ${token}` } });

      setRatings(res.data);
    } catch (err) {
      console.error("Failed to fetch ratings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">⭐ Total Ratings</h1>
        <LogoutButton />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex gap-3">
        <input
          name="store_name"
          placeholder="Store Name"
          value={filters.store_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="user_name"
          placeholder="User Name"
          value={filters.user_name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchRatings}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      {/* Ratings Table */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : ratings.length === 0 ? (
          <p className="p-4 text-gray-500">No ratings found</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Store</th>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Rating</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => (
                <tr key={r.id} className="hover:bg-gray-100">
                  <td className="p-2">{r.store_name}</td>
                  <td className="p-2">{r.user_name}</td>
                  <td className="p-2">⭐ {r.rating}</td>
                  <td className="p-2">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminRatings;
