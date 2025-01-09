import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export function useFetchWithAuth() {
  const { auth } = useContext(AuthContext);

  const fetchWithAuth = async (url, options = {}) => {
    const headers = options.headers || {};
    if (auth.token) {
      headers["Authorization"] = `Bearer ${auth.token}`;
    }
    return fetch(url, { ...options, headers });
  };

  return fetchWithAuth;
}
