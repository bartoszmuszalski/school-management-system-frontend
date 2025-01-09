import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../../../contexts/AuthContext"; // Import AuthContext

const NavBar = styled.nav`
  background-color: #333;
  padding: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  margin-right: 1rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function Navigation() {
  const { auth, logout } = useContext(AuthContext); // Wyciągnięcie auth i logout z AuthContext

  return (
    <NavBar>
      {!auth.isLoggedIn ? (
        <>
          <NavLink to="/register">Rejestracja</NavLink>
          <NavLink to="/login">Logowanie</NavLink>
          <NavLink to="/reset-password">Resetowanie Hasła</NavLink>
        </>
      ) : (
        <>
          <span style={{ color: "white", marginRight: "1rem" }}>
            Witaj, {auth.user?.email}
          </span>
          <button
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={logout}
          >
            Wyloguj
          </button>
        </>
      )}
    </NavBar>
  );
}

export default Navigation;
