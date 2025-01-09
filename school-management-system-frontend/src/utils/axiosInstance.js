import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/api/v1", // Zmień na odpowiedni URL API
  headers: {
    "Content-Type": "application/json",
  },
});

// Dodanie tokenu Bearer do nagłówka
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Pobieranie tokenu z localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Dodawanie tokenu do nagłówka
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
