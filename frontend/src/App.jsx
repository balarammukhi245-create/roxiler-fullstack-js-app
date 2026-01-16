import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.page.jsx";
import Signup from "./pages/Signup.page.jsx";
import Dashboard from "./pages/Dashboard.page.jsx";
import AdminDashboard from "./pages/AdminDashboard.page.jsx";
import UserDashboard from "./pages/UserDashboard.page.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.page.jsx";
import UpdatePassword from "./pages/UpdatePassword.page.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


import AdminAddUser  from "./adminUtils/AdminAddUser";
import AdminAddStore from "./adminUtils/AdminAddStore";
import AdminUsers from "./adminUtils/AdminUsers";
import AdminStores from "./adminUtils/AdminStores";
import AdminUserDetails from "./adminUtils/AdminUserDetails";
import AdminRatings from "./adminUtils/AdminRatings";

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
        path="/update-password"
        element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        }
      />

 {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-user"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAddUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-store"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAddStore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUserDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStores />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ratings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRatings />
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
