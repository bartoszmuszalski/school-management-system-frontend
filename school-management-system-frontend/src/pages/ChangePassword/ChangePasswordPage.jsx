import AuthForm from "../../components/Auth/AuthForm/AuthForm";
import React, { useState } from "react";

function ResetPasswordPage() {
  const [message, setMessage] = useState("");

  const handleResetPassword = async (fieldValues) => {
    const { email, password, token } = fieldValues;

    const response = await fetch(
      "http://localhost/api/v1/user/change_forgotten_password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, token }),
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
    return { message: "Reset password success" };
  };

  return (
    <AuthForm
      title="Change Password"
      fields={[
        { name: "email", type: "email", label: "Email", required: true },
        {
          name: "password",
          type: "password",
          label: "NewPassword",
          required: true,
        },
        { name: "token", type: "token", label: "Token", required: true },
      ]}
      submitButtonText="Change password"
      onSubmit={handleResetPassword}
      message={message}
      setMessage={setMessage}
    />
  );
}

export default ResetPasswordPage;
