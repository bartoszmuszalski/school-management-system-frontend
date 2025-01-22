import React, { useState } from "react";
import AuthForm from "../AuthForm/AuthForm";
import apiConfig from "../../../config";

function AuthPage({
  title,
  fields,
  submitButtonText,
  apiEndpoint,
  successMessage,
  verificationMessage,
  onSuccess, // Obsługa sukcesu
}) {
  const [message, setMessage] = useState("");

  const handleAuth = async (fieldValues) => {
    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/user/${apiEndpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fieldValues),
        }
      );

      if (!response.ok) {
        // Odczytaj szczegóły błędu z odpowiedzi
        const errorData = await response.json();
        let errorMessage = `${errorData}`;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          if (errorData.errors.validation) {
            errorMessage = errorData.errors.validation;
          } else {
            errorMessage = errorData.errors;
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      if (onSuccess) {
        onSuccess(result); // Wywołaj onSuccess w przypadku powodzenia
      }
      return { message: successMessage, ...result };
    } catch (error) {
      console.error("Error in handleAuth:", error);
      throw error;
    }
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
      verificationMessage={verificationMessage}
    />
  );
}

export default AuthPage;
