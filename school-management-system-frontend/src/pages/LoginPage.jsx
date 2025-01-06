import React, { useEffect, useState } from "react";
import AuthPage from "../components/AuthPage/AuthPage";
import { useLocation } from "react-router-dom";

function LoginPage() {
  const [verificationMessage, setVerificationMessage] = useState(null);
  const location = useLocation();

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

  return (
    <div>
      {/* Usunięcie stąd, będziemy wyświetlać w AuthForm */}
      <AuthPage
        title="Logowanie"
        fields={loginFields}
        submitButtonText="Zaloguj"
        apiEndpoint="login"
        successMessage="Login successful"
        verificationMessage={verificationMessage} // Przekazujemy stan jako prop
      />
    </div>
  );
}

export default LoginPage;
