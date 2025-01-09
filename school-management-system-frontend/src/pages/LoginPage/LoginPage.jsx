import React, { useEffect, useState } from "react";
import AuthPage from "../../components/Auth/AuthPage/AuthPage";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext"; // Import AuthContext

function LoginPage() {
  const [verificationMessage, setVerificationMessage] = useState(null);
  const location = useLocation();
  const { login } = useContext(AuthContext); // Access login from context

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("verificationSuccess");

    if (success === "true") {
      setVerificationMessage("Użytkownik zweryfikowany!");
    } else {
      setVerificationMessage(null); // Dodaj to, aby usunąć wiadomość, gdy parametr nie jest obecny
    }
  }, [location.search]);

  const loginFields = [
    { name: "username", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Hasło", required: true },
  ];

  const handleLoginSuccess = (data) => {
    const userData = {
      firstName: data.user?.firstName || "Nieznane",
      lastName: data.user?.lastName || "Nieznane",
    };
    login(userData, data.token); // Call the login function from context
  };

  return (
    <div>
      <AuthPage
        title="Logowanie"
        fields={loginFields}
        submitButtonText="Zaloguj"
        apiEndpoint="login"
        successMessage="Login successful"
        verificationMessage={verificationMessage} // Przekazujemy stan jako prop
        onSuccess={handleLoginSuccess} // Pass onSuccess as a prop
      />
    </div>
  );
}

export default LoginPage;
