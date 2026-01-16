import { useEffect, useState } from "react";
import API from "../api/axios";
import StarRating from "../components/StarRating";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: "", address: "" });

  const navigate = useNavigate();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/user/stores?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStores(res.data);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      if (err.response?.status === 401) setError("Unauthorized. Please login again.");
      else if (err.response?.status === 403) setError("Access denied.");
      else setError("Failed to load stores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchStores();
  };

  if (loading) return <p className="p-6">Loading stores...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛍️ User Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="flex justify-end mb-4 gap-3">
        <button
          onClick={() => navigate("/update-password")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </div>

      {/* Search Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex gap-3">
        <input
          name="name"
          placeholder="Search by Store Name"
          value={filters.name}
          onChange={handleChange}
          className="border p-2 rounded flex-1"
        />
        <input
          name="address"
          placeholder="Search by Address"
          value={filters.address}
          onChange={handleChange}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {stores.length === 0 ? (
        <p className="text-gray-600">No stores available.</p>
      ) : (
        <div className="grid gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{store.name}</h2>
                <p className="text-sm text-gray-500">{store.address}</p>
                <p className="text-sm">
                  Overall: {Number(store.overallRating || 0).toFixed(1)} ⭐
                </p>
                <p className="text-sm text-gray-600">
                  Your Rating: {Number(store.userRating || 0).toFixed(1)} ⭐
                </p>
              </div>

              <StarRating
                storeId={store.id}
                defaultRating={Number(store.userRating || 0)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
