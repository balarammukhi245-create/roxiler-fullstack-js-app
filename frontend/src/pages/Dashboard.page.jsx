import { Navigate } from "react-router-dom";

function Dashboard() {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/" replace />;

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "user") return <Navigate to="/user" replace />;
  if (role === "owner") return <Navigate to="/owner" replace />;

  return <Navigate to="/" replace />;
}

export default Dashboard;
