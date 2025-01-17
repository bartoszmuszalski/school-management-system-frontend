import React, { useState } from "react";
import "./AuthForm.css"; // Import stylów
import Modal from "../Shared/Modal";
import { useNavigate } from "react-router-dom";
import logo from "../../Files/logo.png";

function AuthForm({
  title,
  fields,
  submitButtonText,
  onSubmit,
  message,
  setMessage,
  apiEndpoint,
  verificationMessage,
}) {
  const [fieldValues, setFieldValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [token, setToken] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e, name) => {
    setFieldValues({ ...fieldValues, [name]: e.target.value });
  };

  const BASE_URL = "http://localhost:81";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await onSubmit(fieldValues);
      if (result && result.message) {
        setMessage(result.message);
        const token = result.token;
        localStorage.setItem("authToken", token);
        if (result.endpoint) {
        }
        if (apiEndpoint === "register") {
          setUserEmail(fieldValues.email);
          setShowModal(true);
        }
      } else {
        setMessage("Success");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error("handleSubmit: Error:", error);
    }
  };

  const handleVerifyToken = async (event) => {
    event.preventDefault();

    const verifyData = {
      email: userEmail,
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
        setShowModal(false);
        const params = new URLSearchParams();
        params.append("verificationSuccess", "true");

        navigate(`/login?${params.toString()}`);
      } else {
        if (result && result.message) {
          setVerificationStatus(result.message);
        } else {
          setVerificationStatus("Nie udało się zweryfikować emaila");
        }
      }
    } catch (error) {
      setVerificationStatus(`Błąd: ${error.message}`);
      console.error("handleVerifyToken: Błąd:", error);
    }
  };

  return (
    <div className="main-container">
      <header className="header-correct">
        <img
          style={{ marginBottom: "20px" }}
          alt="Your Company"
          src={logo} // Use the imported local logo
          className="mx-auto h-20 w-auto"
        />
        <span className="header-text">{title}</span>
      </header>
      <div className="form-container">
        <form className="styled-form" onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div className="form-group" key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label className="styled-label" htmlFor={field.name}>
                  {field.label}:
                </label>
              </div>
              <input
                className="styled-input"
                type={field.type}
                name={field.name}
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required}
              />
            </div>
          ))}
          <button className="styled-button" type="submit">
            {submitButtonText}
          </button>
          {verificationMessage && (
            <p className="verification-message">{verificationMessage}</p>
          )}
          {message && <p className="message">{message}</p>}
          {verificationStatus && (
            <p className="message">{verificationStatus}</p>
          )}
        </form>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="popup-overlay">
            <div className="popup">
              <div className="modal-content">
                <span className="header">Email Verification</span>
                <p className="modal-text">Email: {userEmail}</p>
                <input
                  className="styled-input"
                  type="text"
                  placeholder="Enter Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
                <button className="styled-button" onClick={handleVerifyToken}>
                  Verify Token
                </button>
                {verificationStatus && (
                  <p className="message">{verificationStatus}</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AuthForm;
