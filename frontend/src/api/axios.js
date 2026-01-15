// src/api/axios.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Global response interceptor for 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("Session expired. Please login again.");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default API;
