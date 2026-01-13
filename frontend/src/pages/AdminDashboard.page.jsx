import LogoutButton from "../components/LogoutButton";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👑 Admin Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">Total Users</div>
        <div className="bg-white p-6 rounded-xl shadow">Total Stores</div>
        <div className="bg-white p-6 rounded-xl shadow">Total Ratings</div>
      </div>
    </div>
  );
}

export default AdminDashboard;
