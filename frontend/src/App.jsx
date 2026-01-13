import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.page.jsx";
import Signup from "./pages/Signup.page.jsx";
import Dashboard from "./pages/Dashboard.page.jsx";
import AdminDashboard from "./pages/AdminDashboard.page.jsx";
import UserDashboard from "./pages/UserDashboard.page.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.page.jsx";
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
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;