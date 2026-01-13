import { Navigate } from "react-router-dom";

function Dashboard() {
  const role = localStorage.getItem("role");

  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "user") return <Navigate to="/user" />;
  if (role === "owner") return <Navigate to="/owner" />;

  return <Navigate to="/" />;
}

export default Dashboard;
