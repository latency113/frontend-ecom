import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add interceptors here for things like auth tokens
api.interceptors.request.use(
  (config) => {
    // Example: Add authorization token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Handle global errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      console.log("Unauthorized request, redirecting to login...");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
