import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DisplayUsers.css";

const UserProfile = () => {
  // Stan dla użytkowników, ładowania i błędu
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pobieranie danych z API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost/api/v1/users/list?page=1&limit=40"
        );
        setUsers(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Funkcja obsługująca weryfikację użytkownika (bez wywołań API)
  const handleVerify = (userId) => {
    console.log(`Verify user with ID: ${userId}`);
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isVerified: true } : user
      )
    );
  };

  // Funkcja obsługująca zmianę roli użytkownika z wywołaniem API
  const handleChangeRole = async (userId, event) => {
    const newRole = event.target.value;
    const token = localStorage.getItem("authToken"); // Pobierz token z localStorage

    try {
      const response = await axios.post(
        `http://localhost/api/v1/user/${userId}/change_role`, // Endpoint API
        { role: newRole }, // Treść żądania
        {
          headers: {
            Authorization: `Bearer ${token}`, // Nagłówki uwierzytelniające
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "ok") {
        // Aktualizacja stanu użytkowników po pozytywnej odpowiedzi
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        // Opcjonalnie: Dodaj informację zwrotną dla użytkownika
        console.log(`User ${userId} role changed to ${newRole}`);
      } else {
        // Obsługa innych statusów odpowiedzi
        console.error(
          "Nie udało się zmienić roli użytkownika:",
          response.data.message
        );
        // Opcjonalnie: Wyświetl wiadomość o błędzie użytkownikowi
      }
    } catch (err) {
      console.error("Błąd podczas zmiany roli użytkownika:", err);
      // Opcjonalnie: Wyświetl wiadomość o błędzie użytkownikowi
    }
  };

  // Obsługa stanu ładowania
  if (loading) {
    return <p className="loading">Loading ...</p>;
  }

  // Obsługa błędów
  if (error) {
    return <p className="error">Error: {error.message}</p>;
  }

  // Wyświetlanie listy użytkowników
  return (
    <div className="container">
      <p className="myParagraphClass">List of users in the system</p>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Is Verified</th>
            <th>Action</th>
            <th>Change Role</th> {/* Dodanie kolumny na zmiany roli */}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td style={{ fontWeight: "bold" }}>{user.email}</td>
              <td>
                {user.role.slice(5, 20).charAt(0).toUpperCase() +
                  user.role.slice(6, 20).toLowerCase()}
              </td>
              <td>{user.isVerified ? "Yes" : "No"}</td>
              <td className="action-cell">
                {user.isVerified ? (
                  <span>-</span>
                ) : (
                  <button
                    className="VerifyButton"
                    onClick={() => handleVerify(user.id)}
                    aria-label={`Verify user ${user.email}`}
                  >
                    Verify
                  </button>
                )}
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleChangeRole(user.id, e)}
                  aria-label={`Change role for ${user.email}`}
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_STUDENT">Student</option>
                  <option value="ROLE_TEACHER">Teacher</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;
