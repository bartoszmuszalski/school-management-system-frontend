import React, { useEffect, useState } from "react";
import AuthPage from "../../components/Auth/AuthPage/AuthPage";
import { useLocation } from "react-router-dom";
function LoginPage({ onLogin }) {
  const [verificationMessage, setVerificationMessage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("verificationSuccess");

    if (success === "true") {
      setVerificationMessage("Użytkownik zweryfikowany!");
    } else {
      setVerificationMessage(null);
    }
  }, [location.search]);

  const loginFields = [
    { name: "username", type: "email", label: "Email address", required: true },
    { name: "password", type: "password", label: "Password", required: true },
  ];

  const handleLoginSuccess = async (data) => {
    console.log("Login Success Data:", data);
    const token = data.token;
    try {
      const response = await fetch(`http://localhost/api/v1/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `Wystąpił błąd: ${response.status}`;
        throw new Error(message);
      }

      const userResponseData = await response.json();
      onLogin(userResponseData, token);
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
    }
  };

  return (
    <div>
      <AuthPage
        title="Sign in to your account"
        fields={loginFields}
        submitButtonText="Sign in"
        apiEndpoint="login"
        successMessage="Login successful"
        verificationMessage={verificationMessage}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default LoginPage;
