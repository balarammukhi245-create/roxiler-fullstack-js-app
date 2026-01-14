import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👑 Admin Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl mt-2">{stats.totalUsers}</p>
        </div>

        <div
          onClick={() => navigate("/admin/stores")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">Total Stores</h2>
          <p className="text-3xl mt-2">{stats.totalStores}</p>
        </div>

        <div
          onClick={() => navigate("/admin/ratings")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">Total Ratings</h2>
          <p className="text-3xl mt-2">{stats.totalRatings}</p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
