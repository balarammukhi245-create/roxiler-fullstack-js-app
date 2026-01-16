import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👤 User Details</h1>
        <LogoutButton />
      </div>

      <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto space-y-3">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Address:</b> {user.address}</p>
        <p><b>Role:</b> {user.role}</p>

        {user.role === "owner" && (
          <p><b>Rating:</b> {Number(user.rating).toFixed(1)} ⭐</p>
        )}
      </div>
    </div>
  );
}

export default AdminUserDetails;
