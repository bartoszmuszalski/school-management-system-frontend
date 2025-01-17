import React from "react";
import AuthPage from "../../components/Auth/AuthPage/AuthPage";
import { useNotification } from "../../contexts/NotificationContext"; // Import the notification context
import registerFields from "./registerFields";

function RegisterPage() {
  const { showNotification } = useNotification(); // Use the notification context

  const handleRegisterSuccess = () => {
    // Show success notification
    showNotification("Registration successful!");
  };

  return (
    <AuthPage
      title="Register form"
      fields={registerFields}
      submitButtonText="Register"
      apiEndpoint="register"
      successMessage="Registration successful"
      onSuccess={handleRegisterSuccess} // Pass the success handler
    />
  );
}
export default RegisterPage;
