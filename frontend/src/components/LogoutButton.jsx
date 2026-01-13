import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <button
      onClick={logout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
