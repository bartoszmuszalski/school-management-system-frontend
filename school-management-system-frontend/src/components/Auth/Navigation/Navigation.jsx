import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import "./Navigation.css";
import logo from "../../Files/logo.png";
import register_pic from "../../Files/register.png";
import login_pic from "../../Files/login.png";
import reset_pic from "../../Files/reset-password.png";
import logout_pic from "../../Files/logout.png";
import users_pic from "../../Files/users.png";
import subjects_pic from "../../Files/subjects.png";
import classroom_pic from "../../Files/user_classroom.png";
import useradd_pic from "../../Files/user-add.png";

import { useNavigate } from "react-router-dom";
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
            <Link
              to="/login"
              className="sidebar-link-img"
              data-tooltip="Subjects"
            >
              <img
                src={subjects_pic}
                alt="Subjects"
                className="register-icon"
              />
            </Link>
            <Link to="/users" className="sidebar-link-img" data-tooltip="Users">
              <img src={users_pic} alt="Users" className="register-icon" />
            </Link>
            <Link
              to="/login"
              className="sidebar-link-img"
              data-tooltip="User add"
            >
              <img src={useradd_pic} alt="User add" className="register-icon" />
            </Link>
            <Link
              to="/classroom"
              className="sidebar-link-img"
              data-tooltip="User classroom"
            >
              <img
                src={classroom_pic}
                alt="User classroom"
                className="register-icon"
              />
            </Link>
            {/* <span className="sidebar-user-info">
              Hello, {user?.firstName} {user?.lastName}
            </span> */}
            <button
              onClick={onLogout}
              className="sidebar-link-img"
              data-tooltip="Logout"
            >
              <img src={logout_pic} alt="Logout" className="register-icon" />
            </button>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navigation;
