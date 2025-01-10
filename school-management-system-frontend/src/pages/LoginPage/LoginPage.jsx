import React, { useEffect, useState } from "react";
import AuthPage from "../../components/Auth/AuthPage/AuthPage";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function LoginPage() {
  const [verificationMessage, setVerificationMessage] = useState(null);
  const location = useLocation();
  const { login } = useContext(AuthContext);

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
    { name: "username", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Hasło", required: true },
  ];

  const handleLoginSuccess = async (data) => {
    const token = data.token;
    // console.log(typeof token);
    try {
      const response = await fetch(`http://localhost/api/v1/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Wyświetlenie całej odpowiedzi przed parsowaniem na JSON
      console.log("Response: ", response); // Możesz również wyświetlić response.status, response.ok itd.

      if (!response.ok) {
        const message = `Wystąpił błąd: ${response.status}`;
        throw new Error(message);
      }

      // Parsowanie odpowiedzi jako JSON
      const userResponseData = await response.json();

      // Wyświetlenie przetworzonej odpowiedzi w JSON
      console.log("User Data: ", userResponseData);

      login(userResponseData, token);
    } catch (error) {
      console.error("Błąd podczas pobierania danych użytkownika:", error);
      // Obsłuż błąd
    }
  };

  return (
    <div>
      <AuthPage
        title="Logowanie"
        fields={loginFields}
        submitButtonText="Zaloguj"
        apiEndpoint="login"
        successMessage="Login successful"
        verificationMessage={verificationMessage}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default LoginPage;
