import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavContainer = styled.nav`
  background: #333;
  color: white;
  min-width: 200px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 10px;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  transition: background-color 0.3s ease;

  &:hover,
  &.active {
    background: #555;
  }
`;

const Navbar = () => {
  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <StyledNavLink to="/dashboard" activeClassName="active">
            Dashboard
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/login" activeClassName="active">
            Login
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/register" activeClassName="active">
            Register
          </StyledNavLink>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default Navbar;
