import axios from "axios";
import Cookies from "js-cookie";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api` || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    // Clear tokens if unauthorized
    Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`);
    Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_refreshToken`);
    window.location.href = "/login"; // redirect to login
  }
  return Promise.reject(error);
}
);

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const fetchUserProfile = async () => {
  const res = await api.get("/admin/me");
  return res.data;
};

// Logout function
export const logoutUser = () => {
  // Remove access and refresh tokens
  Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`);
  Cookies.remove(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_refreshToken`);

  window.location.href = "/login";
};
