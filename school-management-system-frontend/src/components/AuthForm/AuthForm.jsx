import React, { useState } from "react";
import "./AuthForm.css"; // Import stylów
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

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

  const BASE_URL = "http://localhost";

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("handleSubmit: Dane do wysłania:", fieldValues);

    try {
      const result = await onSubmit(fieldValues);
      console.log("handleSubmit: Odpowiedź z serwera:", result);
      if (result && result.message) {
        setMessage(result.message);
        console.log("handleSubmit: Wiadomość z serwera:", result.message);
        if (result.endpoint) {
          console.log(
            "handleSubmit: Pełny endpoint z odpowiedzi:",
            result.endpoint
          );
        }
        console.log("handleSubmit: apiEndpoint:", apiEndpoint);
        if (apiEndpoint === "register") {
          setUserEmail(fieldValues.email);
          setShowModal(true);
          console.log("handleSubmit: Modal ustawiony na widoczny.");
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

    console.log("handleVerifyToken: Dane weryfikacyjne:", verifyData);

    try {
      console.log("handleVerifyToken: Wysyłanie żądania do:", verifyEndpoint);
      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyData),
      });

      const result = await response.json();
      console.log("handleVerifyToken: Odpowiedź z serwera:", result);
      if (result && result.status === "ok") {
        setShowModal(false);
        console.log("handleVerifyToken: Email zweryfikowany.");
        const params = new URLSearchParams();
        params.append("verificationSuccess", "true");

        navigate(`/login?${params.toString()}`);
      } else {
        // W przypadku braku `status: ok`, sprawdzamy message
        if (result && result.message) {
          setVerificationStatus(result.message);
        } else {
          setVerificationStatus("Nie udało się zweryfikować emaila");
          console.log("handleVerifyToken: Błąd weryfikacji.");
        }
      }
    } catch (error) {
      setVerificationStatus(`Błąd: ${error.message}`);
      console.error("handleVerifyToken: Błąd:", error);
    }
  };

  return (
    <div className="main-container">
      <header className="header">
        <span className="header-text">{title}</span>
      </header>
      <div className="form-container">
        <form className="styled-form" onSubmit={handleSubmit}>
          <h2 className="styled-title">{title}</h2>
          {fields.map((field, index) => (
            <div className="form-group" key={index}>
              <label className="styled-label" htmlFor={field.name}>
                {field.label}:
              </label>
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
          <h2>Weryfikacja Email</h2>
          <p>Email: {userEmail}</p>
          <input
            className="styled-input"
            type="text"
            placeholder="Wprowadź token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <button className="styled-button" onClick={handleVerifyToken}>
            Zweryfikuj
          </button>
          {verificationStatus && (
            <p className="message">{verificationStatus}</p>
          )}
        </Modal>
      )}
    </div>
  );
}

export default AuthForm;
