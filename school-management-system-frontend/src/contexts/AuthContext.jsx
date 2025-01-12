import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    setToken(token);
    console.log("Logged in:", userData, "token", token);
  };
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    console.log("Wylogowano.");
  };
  const getAuthToken = () => {
    // funkcja do pobrania tokenu
    return localStorage.getItem("authToken");
  };

  const contextValues = {
    isLoggedIn,
    user,
    token,
    login,
    logout,
    getAuthToken, // dodanie nowej funkcji
  };
  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
