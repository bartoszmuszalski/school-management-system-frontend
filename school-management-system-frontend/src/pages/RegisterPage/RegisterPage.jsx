import React from "react";
import AuthPage from "../../components/Auth/AuthPage/AuthPage";
import { useNotification } from "../../contexts/NotificationContext"; // Import the notification context

function RegisterPage() {
  const { showNotification } = useNotification(); // Use the notification context

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

  const handleRegisterSuccess = () => {
    // Show success notification
    showNotification("Registration successful!");
  };

  return (
    <AuthPage
      title="Register Form"
      fields={registerFields}
      submitButtonText="Register"
      apiEndpoint="register"
      successMessage="Registration successful"
      onSuccess={handleRegisterSuccess} // Pass the success handler
    />
  );
}

export default RegisterPage;
