import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const context = useContext(AuthContext) || {};
  const { isLoggedIn } = context;

  // Dodano warunek sprawdzający czy kontekst jest ładowany, aby nie przekierowywać za wcześnie.
  if (context && (isLoggedIn === undefined)) {
    return null; // lub jakiś spinner, loader
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;