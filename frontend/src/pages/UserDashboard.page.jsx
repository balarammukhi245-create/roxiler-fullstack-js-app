import { useEffect, useState } from "react";
import API from "../api/axios";
import StarRating from "../components/StarRating";
import LogoutButton from "../components/LogoutButton";

function UserDashboard() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const res = await API.get("/user/stores");
      setStores(res.data);
    };

    fetchStores();
  }, []);

  return (
    <div className="p-6">
            <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"> User Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="grid gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{store.name}</h2>
              <p className="text-sm text-gray-500">{store.address}</p>
              <p className="text-sm">Overall: {store.overallRating.toFixed(1)} ⭐</p>
            </div>

            <StarRating
              storeId={store.id}
              defaultRating={store.userRating || 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
