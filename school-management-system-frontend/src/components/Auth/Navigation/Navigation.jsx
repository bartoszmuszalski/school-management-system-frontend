import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext"; // Import AuthContext
import "./Navigation.css"; // Import pliku CSS

function Navigation({ onLogout }) {
  const context = useContext(AuthContext) || {};
  const { isLoggedIn, user } = context;

  return (
    <nav className="nav-bar">
      {!isLoggedIn ? (
        <>
          <Link to="/register" className="nav-link">
            Registration
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/reset-password" className="nav-link">
            Reset Password
          </Link>
          <Link to="/change-password" className="nav-link">
            Change Password
          </Link>
        </>
      ) : (
        <>
          <span className="nav-user-info">
            Hello, {user?.firstName} {user?.lastName}
          </span>
          <button className="nav-logout-button" onClick={onLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navigation;
