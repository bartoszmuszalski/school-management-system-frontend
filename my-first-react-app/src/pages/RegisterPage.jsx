import React from "react";
import AuthPage from "../components/AuthPage/AuthPage";

function RegisterPage() {
  const registerFields = [
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Password", required: true },
    // { name: 'passwordConfirm', type: 'password', label: 'Powtórz hasło', required: true },
  ];

  return (
    <AuthPage
      title="Register Form"
      fields={registerFields}
      submitButtonText="Register"
      apiEndpoint="register"
      successMessage="Registration successful"
    />
  );
}

export default RegisterPage;
