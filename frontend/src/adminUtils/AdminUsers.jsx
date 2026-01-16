import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import LogoutButton from "../components/LogoutButton";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/admin/users?${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 Users</h1>
        <LogoutButton />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-wrap gap-3">
        <input
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded"
        />

        <input
          name="email"
          value={filters.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded"
        />

        <input
          name="address"
          value={filters.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded"
        />

        <select
          name="role"
          value={filters.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>

        <button
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.address}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length === 0 && (
          <p className="p-4 text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
