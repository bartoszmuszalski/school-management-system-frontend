import React, { useState } from "react";
import "./VerificationModal.css";
import { useNavigate } from "react-router-dom";
import apiConfig from "../../../config";

function VerificationModal({ email, onClose, onVerified }) {
  const [token, setToken] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleVerifyToken = async (event) => {
    event.preventDefault();
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
        setVerificationStatus("Email verified. Redirecting...");
        setTimeout(() => {
          onClose();
          navigate("/dashboard", {
            state: { showPopup: true, message: "Registration successful!" },
          });
        }, 1000);
      } else {
        if (result && result.message) {
          setApiError(result.errors.validation);
        } else {
          setApiError("No able to verify email");
        }
      }
    } catch (error) {
      setApiError(`${error.message}`);
    }
  };

  return (
    <div className="verification-modal">
      <div className="verification-modal-content">
        <span className="header-text">{title}</span>
        <p>Email: {email}</p>
        <input
          type="text"
          placeholder="Enter Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <button onClick={handleVerifyToken}>Verify</button>
        {apiError && <p className="error">{apiError}</p>}
        {verificationStatus && <p className="success">{verificationStatus}</p>}
        <button onClick={onClose} className="close-button">
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default VerificationModal;
