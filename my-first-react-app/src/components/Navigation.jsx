// my-first-react-app/src/components/Navigation.jsx

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
  return (
    <NavBar>
      <NavLink to="/register">Rejestracja</NavLink>
      <NavLink to="/login">Logowanie</NavLink>
      <NavLink to="/reset-password">Resetowanie Hasła</NavLink>
    </NavBar>
  );
}

export default Navigation;
