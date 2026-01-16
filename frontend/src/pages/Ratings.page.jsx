import { useEffect, useState } from "react";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function RatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/ratings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(res.data);
    } catch (err) {
      console.error("Failed to load ratings:", err);
      setError("Failed to fetch ratings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  if (loading) return <p className="p-6">Loading ratings...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">⭐ Ratings</h1>
        <LogoutButton />
      </div>

      {ratings.length === 0 ? (
        <p className="text-gray-600">No ratings available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Store Name</th>
                <th className="p-2">User Email</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map(r => (
                <tr key={r.id} className="hover:bg-gray-100">
                  <td className="p-2">{r.store_name}</td>
                  <td className="p-2">{r.user_email}</td>
                  <td className="p-2">{Number(r.rating).toFixed(1)} ⭐</td>
                  <td className="p-2">{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RatingsPage;
