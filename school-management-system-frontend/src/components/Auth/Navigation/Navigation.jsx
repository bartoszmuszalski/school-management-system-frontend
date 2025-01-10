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
  const context = useContext(AuthContext) || {}; // Default do pustego obiektu
  const { isLoggedIn, user, logout } = context; // Destructuring z context

  return (
      <NavBar>
        {!isLoggedIn ? (
            <>
              <NavLink to="/register">Rejestracja</NavLink>
              <NavLink to="/login">Logowanie</NavLink>
              <NavLink to="/reset-password">Resetowanie Hasła</NavLink>
            </>
        ) : (
            <>
          <span style={{ color: "white", marginRight: "1rem" }}>
            Witaj, {user?.firstName} {user?.lastName}
          </span>
              <button
                  style={{
                    position: "absolute",
                    right: "1rem",
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