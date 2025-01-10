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
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";
import Navigation from "../components/Auth/Navigation/Navigation";
import ProtectedRoute from "../components/Auth/ProtectedRoute/ProtectedRoute";
import UserProfile from "../components/UserProfile";
import { AuthProvider, AuthContext } from "../contexts/AuthContext"; // Import AuthProvider

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
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload()
    };
    return (
        <>
            <GlobalStyle />
            <Navigation />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
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
}

export default App;