import React, { useState } from "react";
import "./VerificationModal.css";
import { useNavigate } from "react-router-dom";

function VerificationModal({ email, onClose, onVerified }) {
  const [token, setToken] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost";

  const handleVerifyToken = async (event) => {
    event.preventDefault();
    const verifyData = {
      email: email,
      token: token,
    };
    const verifyEndpoint = `${BASE_URL}/api/v1/user/verify_email`;

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
        setVerificationStatus("Email zweryfikowany. Przekierowanie...");
        setTimeout(() => {
          onClose();
          navigate("/dashboard", {
            state: { showPopup: true, message: "Registration successful!" },
          });
        }, 1000);
      } else {
        if (result && result.message) {
          setApiError(result.message);
        } else {
          setApiError("Nie udało się zweryfikować emaila");
        }
      }
    } catch (error) {
      setApiError(`Błąd: ${error.message}`);
    }
  };

  return (
    <div className="verification-modal">
      <div className="verification-modal-content">
        <h2>Weryfikacja Email</h2>
        <p>Email: {email}</p>
        <input
          type="text"
          placeholder="Wprowadź token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <button onClick={handleVerifyToken}>Zweryfikuj</button>
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
