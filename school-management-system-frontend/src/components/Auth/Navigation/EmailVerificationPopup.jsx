import React, { useState } from "react";
import "./EmailVerificationPopup.css";
import apiConfig from "../../../config";
import { useNotification } from "../../../contexts/NotificationContext"; // Import useNotification

function EmailVerificationPopUp({ onClose, email }) {
  // Receive email as prop
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(""); // State for token input
  const { showNotification } = useNotification(); // Use notification context

  const handleResendVerification = async () => {
    setLoading(true);
    setApiError(null);
    setVerificationStatus(null);

    try {
      const resendEndpoint = `${apiConfig.apiUrl}/api/v1/user/resend_verification_code`;
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, type: "email_verification" }), // Use email prop
      });

      const result = await response.json();

      if (response.ok && result.status === "ok") {
        setVerificationStatus(
          "Verification email resent successfully. Please check your inbox."
        );
        showNotification(
          "Verification email resent successfully. Please check your inbox."
        ); // Show notification
      } else {
        setApiError(result.message || "Failed to resend verification email.");
        showNotification(
          result.message || "Failed to resend verification email."
        ); // Show notification
      }
    } catch (error) {
      setApiError(`Error resending verification email: ${error.message}`);
      showNotification(`Error resending verification email: ${error.message}`); // Show notification
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (event) => {
    event.preventDefault();
    setLoading(true);
    setApiError(null);
    setVerificationStatus(null);

    const verifyData = {
      email: email,
      token: token,
    };
    const verifyEndpoint = `${apiConfig.apiUrl}/api/v1/user/verify_email`;

    try {
      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyData),
      });

      const result = await response.json();

      if (result && result.status === "ok") {
        setVerificationStatus("Email verified successfully!");
        showNotification("Email verified successfully!"); // Show success notification
        onClose(); // Close the popup on successful verification
      } else {
        setApiError(
          result.message ||
            result.errors?.validation ||
            "Token verification failed"
        );
        showNotification(
          result.message ||
            result.errors?.validation ||
            "Token verification failed" // Show error notification
        );
      }
    } catch (error) {
      setApiError(`Error verifying token: ${error.message}`);
      showNotification(`Error verifying token: ${error.message}`); // Show error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-verification-overlay">
      <div className="email-verification-popup">
        <h2>Verify Your Email</h2>
        <p>
          Your email address has not yet been verified. Please verify your email
          to access all features.
        </p>
        <p>
          Check your inbox and enter the verification token we sent to:{" "}
          <strong>{email}</strong>.
        </p>

        <input
          className="styled-input" // You might need to add this class or similar styling
          type="text"
          placeholder="Enter verification token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />

        {apiError && <p className="error">{apiError}</p>}
        {verificationStatus && <p className="success">{verificationStatus}</p>}

        <div className="popup-buttons">
          <button
            className="popup-button yes"
            onClick={handleVerifyToken}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Token"}
          </button>
          <button
            className="popup-button yes"
            onClick={handleResendVerification}
            disabled={loading}
          >
            {loading ? "Sending" : "Send Verification Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPopUp;
