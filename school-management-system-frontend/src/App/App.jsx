import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import GlobalStyle from "../styles/GlobalStyle";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";
import Navigation from "../components/Auth/Navigation/Navigation";
import ProtectedRoute from "../components/Auth/ProtectedRoute/ProtectedRoute"; // Import ProtectedRoute

function App() {
    return (
        <Router>
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
                {/* Dodaj inne chronione trasy w razie potrzeby */}
            </Routes>
        </Router>
    );
}

export default App;