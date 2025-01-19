import React, { useState, useContext } from "react";
import "./AuthForm.css"; // Import stylów
import Modal from "../Shared/Modal";
import { useNavigate } from "react-router-dom";
import logo from "../../Files/logo.png";
import apiConfig from "../../../config";
import registerFields from "../../../pages/RegisterPage/registerFields";
import { useNotification } from "../../../contexts/NotificationContext"; // Importuj kontekst powiadomień
import AuthPage from "../AuthPage/AuthPage";
import { Link } from "react-router-dom";
import LoginPage from "../../../pages/LoginPage/LoginPage"; // Assuming this exists
import { AuthContext } from "../../../contexts/AuthContext";

function AuthForm({
  title,
  fields = registerFields,
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
  const { login, onLogin } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const handleLoginSuccess = (userData, token) => {
    login(userData, token);
    showNotification("Login successful");
    navigate("/dashboard");
  };

  const handleChange = (e, name) => {
    setFieldValues({ ...fieldValues, [name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(fieldValues);

    try {
      const result = await onSubmit(fieldValues);
      if (result && result.message) {
        setMessage(result.message);
        const token = result.token;
        localStorage.setItem("authToken", `Bearer ${token}`);
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

  const handleResendToken = async (event) => {
    event.preventDefault();

    const resendToken = {
      email: userEmail,
      type: "email_verification",
    };
    const resendEndpoint = `${apiConfig.apiUrl}/api/v1/user/resend_verification_code`;
    try {
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendToken),
      });
      const result = await response.json();
      if (result && result.status === "ok") {
        setVerificationStatus("Token resent");
      } else {
        setVerificationStatus(result.errors.validation);
      }
    } catch (error) {
      setVerificationStatus(`Error: ${error.message}`);
      console.error("handleResendToken: Error:", error);
    }
  };

  const handleVerifyToken = async (event) => {
    event.preventDefault();

    const verifyData = {
      email: userEmail,
      token: token,
    };
    const verifyEndpoint = `${apiConfig.apiUrl}/api/v1/user/verify_email`;
    const loginEndpoint = `${apiConfig.apiUrl}/api/v1/user/login`; // Poprawiony endpoint logowania

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

        // Wywołanie endpointu logowania po udanej weryfikacji
        try {
          const loginResponse = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: fieldValues.email, // Zmieniono 'email' na 'username'
              password: fieldValues.password,
            }),
          });

          const loginResult = await loginResponse.json();
          if (loginResult && loginResult.token) {
            // Teraz, jeśli login przechodzi, załóżmy, że loginResult.user może być undefined
            // Możesz potrzebować dodatkowego wywołania API, aby pobrać dane użytkownika,
            // jeśli /user/login nie zwraca ich bezpośrednio.
            // Poniżej przykład, jak można by to zrobić:
            if (loginResult.user) {
              localStorage.setItem("authToken", `Bearer ${loginResult.token}`);
              handleLoginSuccess(loginResult.user, loginResult.token);
            } else {
              // Jeśli brak danych użytkownika w odpowiedzi logowania, pobierz je osobno
              const fetchUserEndpoint = `${apiConfig.apiUrl}/api/v1/user/me`; // Załóżmy, że taki jest endpoint
              try {
                const userResponse = await fetch(fetchUserEndpoint, {
                  headers: {
                    Authorization: `Bearer ${loginResult.token}`,
                  },
                });
                const userData = await userResponse.json();
                if (userData) {
                  localStorage.setItem(
                    "authToken",
                    `Bearer ${loginResult.token}`
                  );
                  handleLoginSuccess(userData, loginResult.token);
                } else {
                  console.error(
                    "Login successful, token received, but could not fetch user data."
                  );
                  setVerificationStatus(
                    "Login successful, but could not fetch user data."
                  );
                }
              } catch (fetchUserError) {
                console.error("Error fetching user data:", fetchUserError);
                setVerificationStatus(
                  `Login successful, but error fetching user data: ${fetchUserError.message}`
                );
              }
            }
          } else {
            setVerificationStatus(
              loginResult.message || "Login failed after verification."
            );
          }
        } catch (loginError) {
          setVerificationStatus(
            `Login error after verification: ${loginError.message}`
          );
          console.error("Login error after verification:", loginError);
        }
      } else {
        if (result && result.message) {
          setVerificationStatus(result.message);
        } else {
          setVerificationStatus(result.errors.validation);
        }
      }
    } catch (error) {
      setVerificationStatus(`Error: ${error.message}`);
      console.error("handleVerifyToken: Error:", error);
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
                {field.name === "password" && apiEndpoint === "login" && (
                  <Link to="/reset-password" className="forgot-password-link">
                    Forgot Password?
                  </Link>
                )}
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
                <span className="header-correct">Email verification</span>
                <p className="modal-text">Email: {userEmail}</p>
                <input
                  className="styled-input"
                  type="text"
                  placeholder="Enter token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
                <button className="styled-button" onClick={handleVerifyToken}>
                  Verify token
                </button>
                <button
                  className="styled-button-resend"
                  onClick={handleResendToken}
                >
                  Resend token
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
