import LogoutButton from "../components/LogoutButton";

function OwnerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏪 Owner Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Your Store Ratings</h2>
        <p>⭐⭐⭐⭐☆ (4.0)</p>
      </div>
    </div>
  );
}

export default OwnerDashboard;
