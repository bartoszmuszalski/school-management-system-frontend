import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import GlobalStyle from "../styles/GlobalStyle";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import Navigation from "../components/Auth/Navigation/Navigation";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";
import DisplayUsers from "../components/Users/DisplayUsers";
import ProtectedRoute from "../components/Auth/ProtectedRoute/ProtectedRoute";
import UserProfile from "../components/UserProfile/UserProfile";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import Subjects from "../components/Subjects/Subjects";
import ClassRoom from "../components/ClassRoom/ClassRoom";
import CreateClassRoom from "../components/ClassRoom/CreateClassRoom";
import { NotificationProvider } from "../contexts/NotificationContext"; // Import NotificationProvider

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          {" "}
          {/* Dodano NotificationProvider */}
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

const localToken = localStorage.getItem("user");
const userRoles = localToken ? JSON.parse(localToken).roles : [];
// console.log(String(userRoles));

const AppContent = () => {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (userData, token) => {
    login(userData, token);
    navigate("/dashboard");
  };

  const isAdmin = String(userRoles) === "ROLE_ADMIN";
  // console.log(isAdmin);
  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  const { getUserName } = useContext(AuthContext);

  return (
    <>
      <GlobalStyle />
      <Navigation onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/users"
          element={isAdmin ? <DisplayUsers /> : <Navigate to="/dashboard" />}
        />
        <Route path="/classroom" element={<ClassRoom />} />
        <Route path="/classroom/create" element={<CreateClassRoom />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="hello-user">Hello, {getUserName()}</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
