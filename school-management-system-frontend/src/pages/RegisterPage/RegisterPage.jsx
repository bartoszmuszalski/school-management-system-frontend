import React from "react";
import AuthPage from "../../components/Auth/AuthPage/AuthPage";

function RegisterPage() {
  const registerFields = [
    { name: "firstName", type: "text", label: "First Name", required: true },
    { name: "lastName", type: "text", label: "Last Name", required: true },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "password", type: "password", label: "Password", required: true },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      required: true,
    },
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
