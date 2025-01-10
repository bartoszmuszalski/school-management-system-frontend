// src/utils/fetchWithAuth.js
import axios from "./axios"; // Import instancji axios z utils/axios.js

const fetchWithAuth = async (url, method = "GET", data = null) => {
  const token = localStorage.getItem("authToken");
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    return response.data; // Zwróć same dane, nie cały obiekt response
  } catch (error) {
    console.error("Błąd podczas zapytania z autoryzacją:", error);
    throw error;
  }
};

export default fetchWithAuth;
