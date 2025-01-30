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
import DashBoard from "../components/DashBoard/DashBoard";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import Subjects from "../components/Subjects/Subjects";
import CreateSubject from "../components/Subjects/CreateSubject";
import ClassRoom from "../components/ClassRoom/ClassRoom";
import CreateClassRoom from "../components/ClassRoom/CreateClassRoom";
import StudentGrade from "../components/Grade/StudentGrade";
import { NotificationProvider } from "../contexts/NotificationContext"; // Import NotificationProvider
import { useNotification } from "../contexts/NotificationContext";
import styled from "styled-components";
import ClassRoomList from "../components/ClassRoom/ClassRoomList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

const AppContent = () => {
  const { isLoggedIn, login, logout, user, loading } = useContext(AuthContext); // Pobierz 'loading' z AuthContext
  const navigate = useNavigate();

  // Sprawdź rolę na podstawie danych z kontekstu
  const isAdmin =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_ADMIN");

  const isTeacher =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_TEACHER");

  const isStudent =
    user &&
    user.roles &&
    user.roles.some((role) => role.toUpperCase() === "ROLE_STUDENT");

  // console.log("AppContent: isAdmin status", {
  //   isAdmin,
  //   userRoles: user?.roles,
  // }); // Debug: sprawdź status admina
  // console.log("AppContent: Actual roles received:", user?.roles); // Debug: pokaż jakie role przyszły

  const handleLogin = async (userData, token) => {
    await login(userData, token); // Użyj await, aby poczekać na aktualizację danych użytkownika
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    // window.location.reload(); // Niepotrzebne, AuthContext zarządza stanem
  };

  const { getUserName } = useContext(AuthContext);

  const SuccessNotification = ({ children }) => (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "#4caf50",
        color: "white",
        padding: "16px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }}
    >
      {children}
    </div>
  );

  if (loading) {
    return <div>Loading...</div>; // Dodaj globalny loader, jeśli potrzebny
  }

  return (
    <>
      <GlobalStyle />
      <Navigation onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
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
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subject/create" element={<CreateSubject />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/student/:studentId/grades" element={<StudentGrade />} />
        <Route
          path="/users"
          element={isAdmin ? <DisplayUsers /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/classroom"
          element={
            isAdmin || isTeacher ? <ClassRoom /> : <Navigate to="/dashboard" />
          }
        />
        <Route path="/classroom/create" element={<CreateClassRoom />} />
        <Route
          path="/classroom/:classRoomID/students"
          element={<ClassRoomList />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
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
