import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  // timeout: 20000,
  headers: {
    // "Content-Type": "application/json",
  },
});

/* ============================
   Request Interceptor
============================ */
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_accessToken`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }


    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   Response Interceptor
============================ */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", message);
    return Promise.reject(message);
  }
);

export default api;
