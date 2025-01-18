import React, { useContext, useState, useEffect } from "react";
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

const myRole = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${apiConfig.apiUrl}/api/v1/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.roles;
};

function Navigation({ onLogout }) {
  const context = useContext(AuthContext) || {};
  const { isLoggedIn, user } = context;
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const fetchedRole = await myRole();
        setRole(fetchedRole);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [isLoggedIn]);

  // Renderuj tylko wtedy gdy rola jest już pobrana z serwera
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

  console.log("User role:", role);
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
            {/* User role -  Wait for role message and Logout  */}
            {role &&
              !role.includes("ROLE_ADMIN") &&
              !role.includes("ROLE_TEACHER") &&
              !role.includes("ROLE_STUDENT") && (
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
              )}

            {/* Student Role */}
            {role && role.includes("ROLE_STUDENT") && (
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
            {role && role.includes("ROLE_TEACHER") && (
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
            {role && role.includes("ROLE_ADMIN") && (
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
