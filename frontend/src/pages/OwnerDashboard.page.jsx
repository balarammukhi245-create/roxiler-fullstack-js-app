import { useEffect, useState } from "react";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function OwnerDashboard() {
  const [data, setData] = useState({ store: null, ratings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const res = await API.get("/owner/dashboard");
        if (isMounted) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);

        if (!isMounted) return;

        if (err.response) {
          if (err.response.status === 401) {
            setError("Session expired. Please login again.");
          } else if (err.response.status === 403) {
            setError("Access denied.");
          } else {
            setError("Failed to load dashboard.");
          }
        } else {
          setError("Server is unreachable.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏪 Owner Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Store Info */}
      {data?.store ? (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold">
            Store: {data.store.name}
          </h2>
          <p>📍 {data.store.address}</p>
          <p className="mt-2">
            ⭐ Average Rating:{" "}
            {Number(data.store.averageRating || 0).toFixed(1)}
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <p className="text-gray-600">No store data available.</p>
        </div>
      )}

      {/* Ratings Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Customer Ratings</h2>

        {data?.ratings?.length > 0 ? (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Rating</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.ratings.map((r, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2 border">{r.user_name}</td>
                  <td className="p-2 border">⭐ {r.rating}</td>
                  <td className="p-2 border">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No ratings yet.</p>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
