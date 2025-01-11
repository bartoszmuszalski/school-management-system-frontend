import AuthForm from "../../components/Auth/AuthForm/AuthForm";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleResetPassword = async (fieldValues) => {
    const { email } = fieldValues;

    const response = await fetch(
      "http://localhost/api/v1/user/request_password_change",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      let errorMessage = `Reset failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage += ` ${errorData.message || ""}`;
      } catch (jsonError) {
        console.error("Failed to parse error JSON:", jsonError);
      }
      throw new Error(errorMessage);
    }

    setMessage("Reset password success"); // Set success message
    navigate("/change-password"); // Redirect to /change-password
    return { message: "Reset password success" };
  };

  return (
    <AuthForm
      title="Reset Password"
      fields={[
        { name: "email", type: "email", label: "Email", required: true },
      ]}
      submitButtonText="Reset password"
      onSubmit={handleResetPassword}
      message={message}
      setMessage={setMessage}
    />
  );
}

export default ResetPasswordPage;
