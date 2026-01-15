import { useEffect, useState } from "react";
import API from "../api/axios";
import StarRating from "../components/StarRating";
import LogoutButton from "../components/LogoutButton";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStores = async () => {
      try {
        const res = await API.get("/user/stores");
        if (isMounted) setStores(res.data);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        if (!isMounted) return;

        if (err.response) {
          if (err.response.status === 401) setError("Unauthorized. Please login again.");
          else if (err.response.status === 403) setError("Access denied.");
          else setError("Failed to load stores.");
        } else {
          setError("Server unreachable.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStores();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p className="p-6">Loading stores...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🛍️ User Dashboard</h1>
        <LogoutButton />
      </div>

      {stores.length === 0 ? (
        <p className="text-gray-600">No stores available at the moment.</p>
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
