import React, { useContext, useEffect, useState } from "react";
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
import grades from "../../Files/grades.png";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../../config";
import EmailVerificationPopUp from "./EmailVerificationPopup.jsx"; // Import EmailVerificationPopup

function Navigation({ onLogout }) {
  // console.log("AuthContext w Navigation:", AuthContext); // Debug: Wyświetl sam kontekst
  const context = useContext(AuthContext);
  // console.log("Wynik useContext(AuthContext):", context); // Debug: Wyświetl obiekt kontekstu
  const { isLoggedIn, user, loading, setUser } = context; // Rozpakowanie kontekstu

  const navigate = useNavigate();
  const [showEmailVerificationPopup, setShowEmailVerificationPopup] =
    useState(false); // State for popup

  useEffect(() => {
    if (isLoggedIn && user && !user.isVerified) {
      setShowEmailVerificationPopup(true);
    } else {
      setShowEmailVerificationPopup(false);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`${apiConfig.apiUrl}/api/v1/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Update user data in context, including isVerified
          } else {
            console.error("Failed to fetch user data in Navigation");
          }
        } catch (error) {
          console.error("Error fetching user data in Navigation:", error);
        }
      }
    };
    fetchUserData();
  }, [isLoggedIn, setUser]); // Fetch user data on login status change and setUser

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
          <div>Loading...</div>
        </div>
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
        {showEmailVerificationPopup && user && user.email && (
          <EmailVerificationPopUp
            onClose={() => setShowEmailVerificationPopup(false)}
            email={user.email}
          />
        )}
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
                  to="/my_grades"
                  className="sidebar-link-img"
                  data-tooltip="My grades"
                >
                  <img
                    src={grades}
                    alt="User classroom"
                    className="register-icon"
                  />
                </Link>
                <Link
                  to="/my_subjects"
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
                  style={{ marginTop: "840px", marginLeft: "10px" }}
                  to="/profile"
                  className="sidebar-link-img"
                  data-tooltip="Profile settings"
                >
                  <svg
                    className="register-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width="512"
                    height="512"
                  >
                    <path d="M9,12c3.309,0,6-2.691,6-6S12.309,0,9,0,3,2.691,3,6s2.691,6,6,6Zm0-10c2.206,0,4,1.794,4,4s-1.794,4-4,4-4-1.794-4-4,1.794-4,4-4Zm14.122,9.879c-1.134-1.134-3.11-1.134-4.243,0l-7.879,7.878v4.243h4.243l7.878-7.878c.567-.567,.879-1.32,.879-2.122s-.312-1.555-.878-2.121Zm-1.415,2.828l-7.292,7.293h-1.415v-1.415l7.293-7.292c.377-.378,1.036-.378,1.414,0,.189,.188,.293,.439,.293,.707s-.104,.518-.293,.707Zm-9.778,1.293H5c-1.654,0-3,1.346-3,3v5H0v-5c0-2.757,2.243-5,5-5H13c.289,0,.568,.038,.844,.085l-1.915,1.915Z" />
                  </svg>
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
                  data-tooltip="Classrooms"
                >
                  <img
                    src={classroom_pic}
                    alt="User classroom"
                    className="register-icon"
                  />
                </Link>
                <Link
                  style={{ marginTop: "840px", marginLeft: "10px" }}
                  to="/profile"
                  className="sidebar-link-img"
                  data-tooltip="Profile settings"
                >
                  <svg
                    className="register-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width="512"
                    height="512"
                  >
                    <path d="M9,12c3.309,0,6-2.691,6-6S12.309,0,9,0,3,2.691,3,6s2.691,6,6,6Zm0-10c2.206,0,4,1.794,4,4s-1.794,4-4,4-4-1.794-4-4,1.794-4,4-4Zm14.122,9.879c-1.134-1.134-3.11-1.134-4.243,0l-7.879,7.878v4.243h4.243l7.878-7.878c.567-.567,.879-1.32,.879-2.122s-.312-1.555-.878-2.121Zm-1.415,2.828l-7.292,7.293h-1.415v-1.415l7.293-7.292c.377-.378,1.036-.378,1.414,0,.189,.188,.293,.439,.293,.707s-.104,.518-.293,.707Zm-9.778,1.293H5c-1.654,0-3,1.346-3,3v5H0v-5c0-2.757,2.243-5,5-5H13c.289,0,.568,.038,.844,.085l-1.915,1.915Z" />
                  </svg>
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
                  to="/users"
                  className="sidebar-link-img"
                  data-tooltip="Users"
                >
                  <img src={users_pic} alt="Users" className="register-icon" />
                </Link>
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
                  data-tooltip="All classrooms"
                >
                  <img
                    src={classroom_pic}
                    alt="User classroom"
                    className="register-icon"
                  />
                </Link>

                <Link
                  to="/announcements"
                  className="sidebar-link-img"
                  data-tooltip="Announcements"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-speakerphone"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 8a3 3 0 0 1 0 6" />
                    <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5" />
                    <path d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8" />
                  </svg>
                </Link>
                <Link
                  style={{ marginTop: "840px", marginLeft: "10px" }}
                  to="/profile"
                  className="sidebar-link-img"
                  data-tooltip="Profile settings"
                >
                  <svg
                    className="register-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width="512"
                    height="512"
                  >
                    <path d="M9,12c3.309,0,6-2.691,6-6S12.309,0,9,0,3,2.691,3,6s2.691,6,6,6Zm0-10c2.206,0,4,1.794,4,4s-1.794,4-4,4-4-1.794-4-4,1.794-4,4-4Zm14.122,9.879c-1.134-1.134-3.11-1.134-4.243,0l-7.879,7.878v4.243h4.243l7.878-7.878c.567-.567,.879-1.32,.879-2.122s-.312-1.555-.878-2.121Zm-1.415,2.828l-7.292,7.293h-1.415v-1.415l7.293-7.292c.377-.378,1.036-.378,1.414,0,.189,.188,.293,.439,.293,.707s-.104,.518-.293,.707Zm-9.778,1.293H5c-1.654,0-3,1.346-3,3v5H0v-5c0-2.757,2.243-5,5-5H13c.289,0,.568,.038,.844,.085l-1.915,1.915Z" />
                  </svg>
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
