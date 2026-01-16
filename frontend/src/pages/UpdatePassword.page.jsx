// src/pages/UpdatePassword.page.jsx
import { useState } from "react";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Detect role
  const role = localStorage.getItem("role"); // "admin", "user", or "owner"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
       const res = await API.patch("/auth/update-password", {
        oldPassword,
        newPassword,
      });

      alert(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔒 Update Password</h1>
        <LogoutButton />
      </div>

      <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
