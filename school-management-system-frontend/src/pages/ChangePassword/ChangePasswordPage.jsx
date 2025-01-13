import AuthForm from "../../components/Auth/AuthForm/AuthForm";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function ChangePasswordPage() {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const [initialEmail, setInitialEmail] = useState("");

  useEffect(() => {
    if (location.state && location.state.email) {
      setInitialEmail(location.state.email);
    }
  }, [location.state]);

  const handleChangePassword = async (fieldValues) => {
    const { email, password, repeatPassword, token } = fieldValues;

    const response = await fetch(
      "http://localhost/api/v1/user/change_forgotten_password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, repeatPassword, token }),
      }
    );

    if (!response.ok) {
      let errorMessage = `Change password failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage += ` ${errorData.message || ""}`;
      } catch (jsonError) {
        console.error("Failed to parse error JSON:", jsonError);
      }
      throw new Error(errorMessage);
    }
    return { message: "Password changed successfully" };
  };

  return (
    <AuthForm
      title="Change Password"
      fields={[
        {
          name: "email",
          type: "email",
          label: "Email",
          required: true,
          initialValue: initialEmail, // Ustawienie wartości początkowej
          readOnly: true, // Opcjonalnie, ustaw pole jako tylko do odczytu
        },
        {
          name: "password",
          type: "password",
          label: "Password",
          required: true,
        },
        {
          name: "repeatPassword",
          type: "password",
          label: "New Password",
          required: true,
        },
        { name: "token", type: "text", label: "Token", required: true },
      ]}
      submitButtonText="Change password"
      onSubmit={handleChangePassword}
      message={message}
      setMessage={setMessage}
    />
  );
}

export default ChangePasswordPage;
