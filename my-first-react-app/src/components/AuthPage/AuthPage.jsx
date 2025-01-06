// src/components/AuthPage/AuthPage.jsx
import React, { useState } from "react";
import AuthForm from "../AuthForm/AuthForm";

function AuthPage({
  title,
  fields,
  submitButtonText,
  apiEndpoint,
  successMessage,
  verificationMessage, // Dodaj odbiór verificationMessage
}) {
  const [message, setMessage] = useState("");

  const handleAuth = async (fieldValues) => {
    const response = await fetch(
      `http://localhost/api/v1/user/${apiEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldValues),
      }
    );

    if (!response.ok) {
      let errorMessage = `${
        apiEndpoint.charAt(0).toUpperCase() + apiEndpoint.slice(1)
      } failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage += ` ${errorData.message || ""}`;
      } catch (jsonError) {
        console.error("Failed to parse error JSON:", jsonError);
      }
      throw new Error(errorMessage);
    }
    const result = await response.json();
    return { message: successMessage, ...result };
  };

  return (
    <AuthForm
      title={title}
      fields={fields}
      submitButtonText={submitButtonText}
      onSubmit={handleAuth}
      message={message}
      setMessage={setMessage}
      apiEndpoint={apiEndpoint}
      verificationMessage={verificationMessage} // Dodaj przekazanie verificationMessage
    />
  );
}

export default AuthPage;
