import React from "react";
import AuthPage from "../components/AuthPage/AuthPage";

function LoginPage() {
  const loginFields = [
    { name: "username", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Hasło", required: true },
  ];

  return (
    <AuthPage
      title="Logowanie"
      fields={loginFields}
      submitButtonText="Zaloguj"
      apiEndpoint="login"
      successMessage="Login successful"
    />
  );
}

export default LoginPage;
