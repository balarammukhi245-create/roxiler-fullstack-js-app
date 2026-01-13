import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.page.jsx";
import Signup from "../pages/Signup.page.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
