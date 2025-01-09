import React, { createContext, useState, useEffect } from "react";

// Tworzenie AuthContext
export const AuthContext = createContext();

// Provider komponentu Auth
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null, // { firstName: "", lastName: "" }
    token: null,
  });

  // Ładowanie stanu autoryzacji z localStorage przy montowaniu
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  // Zapisywanie stanu autoryzacji do localStorage za każdym razem, gdy się zmienia
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // Funkcja logowania użytkownika
  const login = (userData, token) => {
    console.log("Logging in user:", userData, "with token:", token);
    setAuth({
      isLoggedIn: true,
      user: userData,
      token: token,
    });
  };

  // Funkcja wylogowania użytkownika
  const logout = async () => {
    try {
      const response = await fetch("http://localhost/api/v1/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`, // Dodanie nagłówka Authorization
        },
      });

      if (!response.ok) {
        let errorMessage = `Wylogowanie nie powiodło się: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage += ` ${errorData.message || ""}`;
        } catch (jsonError) {
          console.error("Nie udało się sparsować JSON błędu:", jsonError);
        }
        throw new Error(errorMessage);
      }

      // Zakładając, że wylogowanie powiodło się
      console.log("User logged out successfully");
      setAuth({
        isLoggedIn: false,
        user: null,
        token: null,
      });
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
      <AuthContext.Provider value={{ auth, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}