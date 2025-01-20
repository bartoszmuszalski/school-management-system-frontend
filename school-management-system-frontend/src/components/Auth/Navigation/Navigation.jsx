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
import apiConfig from "../../../config";

function Navigation({ onLogout }) {
  const { isLoggedIn, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // console.log("Navigation.jsx: User role:", user?.roles);

  if (loading) {
    return (
      <div className="sidebar open">
        <div className="sidebar-header">
          <Link to="/" className="link-icon">
            <img
              alt="Your Company"
              src={logo}
              className="mx-auto h-16 w-auto cursor-pointer hover:opacity-80"
            />
          </Link>
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="sidebar open">
      <div className="sidebar-header">
        <Link to="/" className="link-icon">
          <img
            alt="Your Company"
            src={logo}
            className="mx-auto h-16 w-auto cursor-pointer hover:opacity-80"
          />
        </Link>
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
          </>
        ) : (
          <>
            {/* User role - Wait for role message and Logout */}
            {!user?.roles ||
              (!user.roles.includes("ROLE_ADMIN") &&
                !user.roles.includes("ROLE_TEACHER") &&
                !user.roles.includes("ROLE_STUDENT") && (
                  <>
                    <p className="wait-message">
                      Please wait for an admin to assign your role.
                    </p>
                    <button
                      onClick={onLogout}
                      className="sidebar-link-img"
                      data-tooltip="Logout"
                    >
                      <img
                        src={logout_pic}
                        alt="Logout"
                        className="register-icon"
                      />
                    </button>
                  </>
                ))}

            {/* Student Role */}
            {user?.roles?.includes("ROLE_STUDENT") && (
              <>
                <Link
                  to="/subjects"
                  className="sidebar-link-img"
                  data-tooltip="Subjects"
                >
                  <img
                    src={subjects_pic}
                    alt="Subjects"
                    className="register-icon"
                  />
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
                <button
                  onClick={onLogout}
                  className="sidebar-link-img"
                  data-tooltip="Logout"
                >
                  <img
                    src={logout_pic}
                    alt="Logout"
                    className="register-icon"
                  />
                </button>
              </>
            )}

            {/* Teacher Role */}
            {user?.roles?.includes("ROLE_TEACHER") && (
              <>
                <Link
                  to="/subjects"
                  className="sidebar-link-img"
                  data-tooltip="Subjects"
                >
                  <img
                    src={subjects_pic}
                    alt="Subjects"
                    className="register-icon"
                  />
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
                <button
                  onClick={onLogout}
                  className="sidebar-link-img"
                  data-tooltip="Logout"
                >
                  <img
                    src={logout_pic}
                    alt="Logout"
                    className="register-icon"
                  />
                </button>
              </>
            )}

            {/* Admin Role */}
            {user?.roles?.includes("ROLE_ADMIN") && (
              <>
                <Link
                  to="/subjects"
                  className="sidebar-link-img"
                  data-tooltip="Subjects"
                >
                  <img
                    src={subjects_pic}
                    alt="Subjects"
                    className="register-icon"
                  />
                </Link>
                <Link
                  to="/users"
                  className="sidebar-link-img"
                  data-tooltip="Users"
                >
                  <img src={users_pic} alt="Users" className="register-icon" />
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
                <button
                  onClick={onLogout}
                  className="sidebar-link-img"
                  data-tooltip="Logout"
                >
                  <img
                    src={logout_pic}
                    alt="Logout"
                    className="register-icon"
                  />
                </button>
              </>
            )}
          </>
        )}
      </nav>
    </div>
  );
}

export default Navigation;
