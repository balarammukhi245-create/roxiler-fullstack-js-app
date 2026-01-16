import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function AdminAddStore() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await API.post("/admin/stores", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
      navigate("/admin/stores");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">➕ Add Store</h1>
        <LogoutButton />
      </div>

      <div className="bg-white p-6 rounded-xl shadow max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Store Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="email"
            placeholder="Store Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <textarea
            name="address"
            placeholder="Store Address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="owner_id"
            placeholder="Owner ID"
            value={form.owner_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Creating..." : "Create Store"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAddStore;
