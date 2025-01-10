import React, { useState, useEffect } from "react";
import axios from "axios";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setError("Brak tokena autoryzacji.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/v1/user/me", {
          // Upewnij się, że to jest poprawny adres Twojego backendu
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Błąd pobierania profilu użytkownika:", error);
        setError("Nie udało się pobrać profilu użytkownika.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Ładowanie profilu użytkownika...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  if (user) {
    return (
      <div>
        <h2>Profil Użytkownika</h2>
        <p>ID: {user.id}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.roles.join(", ")}</p>
      </div>
    );
  }

  return null;
}

export default UserProfile;
