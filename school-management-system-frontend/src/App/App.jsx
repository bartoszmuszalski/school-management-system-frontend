import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import GlobalStyle from "../styles/GlobalStyle";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import Navigation from "../components/Auth/Navigation/Navigation";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";
import DisplayUsers from "../components/Users/DisplayUsers";
import ProtectedRoute from "../components/Auth/ProtectedRoute/ProtectedRoute";
import UserProfile from "../components/UserProfile/UserProfile";
import { AuthProvider, AuthContext } from "../contexts/AuthContext"; // Import AuthProvider
import Subjects from "../components/Subjects/Subjects";
import ClassRoom from "../components/ClassRoom/ClassRoom";
import CreateClassRoom from "../components/ClassRoom/CreateClassRoom";
// import EditClassRoom from "../components/ClassRoom/EditClassRoom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

const AppContent = () => {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (userData, token) => {
    login(userData, token);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <GlobalStyle />
      <Navigation onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/profile" />
            ) : (
              <LoginPage onLogin={handleLogin} /> // przekazanie funkcji handleLogin
            )
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/users" element={<DisplayUsers />} />
        {/* <Route path="/subjects" element={<Subjects />} /> */}
        <Route path="/classroom" element={<ClassRoom />} />
        <Route path="/classroom/create" element={<CreateClassRoom />} />
        {/* <Route path="/classroom/edit/:id" element={<EditClassRoom />} /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard</div>
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
