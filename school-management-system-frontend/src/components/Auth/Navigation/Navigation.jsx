import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import "./Navigation.css";
import logo from "../../Files/logo.png";
import register_pic from "../../Files/register.png";
import login_pic from "../../Files/login.png";
import reset_pic from "../../Files/reset-password.png";

const UsersButton = ({ to, text, iconSrc }) => (
  <Link to={to} className="sidebar-users-button">
    <img src={iconSrc} alt={text} className="sidebar-users-icon" />
    <span className="sidebar-users-text">{text}</span>
  </Link>
);
function Navigation({ onLogout }) {
  const context = useContext(AuthContext) || {};
  const { isLoggedIn, user } = context;

  return (
    <div className="sidebar open">
      <div className="sidebar-header">
        <img
          style={{ marginBottom: "20px" }}
          alt="Your Company"
          src={logo} // Use the imported local logo
          className="mx-auto h-16 w-auto"
        />
      </div>
      <nav className="sidebar-nav">
        {!isLoggedIn ? (
          <>
            <Link
              to="/register"
              className="sidebar-link-img"
              data-tooltip="Register"
            >
              <img
                src={register_pic}
                alt="Register"
                className="register-icon"
              />
            </Link>
            <Link to="/login" className="sidebar-link-img" data-tooltip="Login">
              <img src={login_pic} alt="Login" className="register-icon" />
            </Link>
            <Link
              to="/reset-password"
              className="sidebar-link-img"
              data-tooltip="Reset"
            >
              <img
                src={reset_pic}
                alt="Reset Password"
                className="register-icon"
              />
            </Link>
            {/* <Link to="/change-password" className="sidebar-link">
              Change Password
            </Link> */}
          </>
        ) : (
          <>
            <span className="sidebar-user-info">
              Hello, {user?.firstName} {user?.lastName}
            </span>
            <button className="sidebar-logout-button" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navigation;
