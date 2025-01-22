import React, { useState } from "react";
import AuthForm from "../../components/Auth/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";
import apiConfig from "../../config";

function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [resetRequested, setResetRequested] = useState(false);
  const navigate = useNavigate();

  // Handler for initial password reset request
  const handleResetPassword = async (fieldValues) => {
    const { email } = fieldValues;
    setEmail(email);

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/user/request_password_change`,
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

          // Zaktualizuj komunikat błędu na podstawie struktury danych z JSON
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            if (errorData.errors.validation) {
              errorMessage = errorData.errors.validation;
            } else {
              errorMessage = JSON.stringify(errorData.errors); // Upewnij się, że errors jest stringiem
            }
          } else {
            errorMessage = JSON.stringify(errorData); // Jeśli nie message/errors, wyświetl cały obiekt
          }
        } catch (jsonError) {
          console.error("Failed to parse error JSON:", jsonError);
          // Jeśli parsowanie JSON się nie powiedzie, zostaw oryginalny komunikat z statusu
        }
        throw new Error(errorMessage);
      }

      setMessage("Reset password success");
      setPopupVisible(true);
    } catch (error) {
      console.error("Error during password reset:", error);
      setMessage(error.message);
    }
  };

  // Handler for changing the password after receiving the token
  const handleChangePassword = async (fieldValues) => {
    const { password, repeatPassword, token } = fieldValues;

    // Basic client-side validation
    if (password !== repeatPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/api/v1/user/change_forgotten_password`,
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

          // Zaktualizuj komunikat błędu na podstawie struktury danych z JSON
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            if (errorData.errors.validation) {
              errorMessage = errorData.errors.validation;
            } else {
              errorMessage = JSON.stringify(errorData.errors); // Upewnij się, że errors jest stringiem
            }
          } else {
            errorMessage = JSON.stringify(errorData); // Jeśli nie message/errors, wyświetl cały obiekt
          }
        } catch (jsonError) {
          console.error("Failed to parse error JSON:", jsonError);
          // Jeśli parsowanie JSON się nie powiedzie, zostaw oryginalny komunikat z statusu
        }
        throw new Error(errorMessage);
      }

      setMessage("Password changed successfully!");
      setPopupVisible(true);
      // Optionally, navigate to login page or another page after successful change
      // navigate("/login");
    } catch (error) {
      console.error("Error during password change:", error);
      setMessage(error.message);
    }
  };

  // Handler to close the popup
  const closePopup = () => {
    setPopupVisible(false);
    setMessage("");
    if (!resetRequested) {
      setResetRequested(true); // Show additional fields after initial reset
    } else {
      // Optionally, reset the form or navigate away after password change
      navigate("/login"); // Example: Redirect to login page
    }
  };

  // Define form fields based on the current phase
  const formFields = resetRequested
    ? [
        {
          name: "email",
          type: "email",
          label: "Email",
          required: true,
          initialValue: email,
          readOnly: true,
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
          label: "Repeat Password",
          required: true,
        },
        {
          name: "token",
          type: "text",
          label: "Token",
          required: true,
        },
      ]
    : [
        {
          name: "email",
          type: "email",
          label: "Email",
          required: true,
        },
      ];

  // Define submit button text based on the current phase
  const submitButtonText = resetRequested
    ? "Change Password"
    : "Reset Password";

  // Define the onSubmit handler based on the current phase
  const onSubmitHandler = resetRequested
    ? handleChangePassword
    : handleResetPassword;

  return (
    <div className="reset-password-container">
      <AuthForm
        title={resetRequested ? "Change Password" : "Reset Password"}
        fields={formFields}
        submitButtonText={submitButtonText}
        onSubmit={onSubmitHandler}
        message={message}
        setMessage={setMessage}
      />

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>
              {resetRequested
                ? "Password Changed Successfully"
                : "Password Reset Requested"}
            </h2>
            <p>
              {resetRequested
                ? "Your password has been changed successfully. You can now log in with your new password."
                : `A password reset token has been sent to ${email}. Please check your email to proceed.`}
            </p>
            <button className="close-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPasswordPage;
