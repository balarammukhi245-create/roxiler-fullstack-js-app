import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.page.jsx";
import Signup from "./pages/Signup.page.jsx";
import Dashboard from "./pages/Dashboard.page.jsx";
import AdminDashboard from "./pages/AdminDashboard.page.jsx";
import UserDashboard from "./pages/UserDashboard.page.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.page.jsx";
import UpdatePassword from "./pages/UpdatePassword.page.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/update-password"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <UpdatePassword />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
