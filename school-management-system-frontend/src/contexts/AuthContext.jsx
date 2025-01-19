import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import apiConfig from "../config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    console.log("Wylogowano.");
  }, []);

  const fetchUser = useCallback(
    async (authToken) => {
      if (!authToken) return;
      try {
        const response = await fetch(`${apiConfig.apiUrl}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          console.error("Failed to fetch user data");
          logout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    [logout]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const loadUser = async () => {
      if (storedToken) {
        setIsLoggedIn(true);
        setToken(storedToken);
        await fetchUser(storedToken);
      }
      setLoading(false);
    };
    loadUser();
  }, [fetchUser, setToken, setLoading, setIsLoggedIn]); // Corrected dependency: setLoading

  const login = useCallback(async (userData, authToken) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setToken(authToken);
    setUser(userData);
  }, []);

  const getAuthToken = useCallback(() => localStorage.getItem("authToken"), []);
  const getUserName = useCallback(
    () => (user ? `${user.firstName} ${user.lastName}` : null),
    [user]
  );

  const contextValues = useMemo(
    () => ({
      isLoggedIn,
      user,
      token,
      login,
      logout,
      getAuthToken,
      getUserName,
      loading,
    }),
    [isLoggedIn, user, token, login, logout, getAuthToken, getUserName, loading]
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
