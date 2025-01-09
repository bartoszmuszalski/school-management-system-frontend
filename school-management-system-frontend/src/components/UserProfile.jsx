// src/components/UserProfile.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobranie danych użytkownika
    axiosInstance
      .get("/user/me")
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych użytkownika:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!user) {
    return <div>Nie znaleziono danych użytkownika</div>;
  }

  return (
    <div>
      <h1>Profil użytkownika</h1>
      <p>ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.roles.join(", ")}</p>
    </div>
  );
};

export default UserProfile;
