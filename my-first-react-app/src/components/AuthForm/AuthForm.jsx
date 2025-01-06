import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    rgb(106, 156, 119),
    rgb(64, 15, 187)
  );
  animation: ${fadeIn} 0.6s ease-in-out;
`;

const Header = styled.header`
  font-family: "Roboto", sans-serif; /* Bardziej nowoczesna czcionka */
  padding: 25px 20px; /* Większy padding */
  text-align: center;
  color: white;
  font-size: 1.8em; /* Większy rozmiar czcionki */
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const HeaderText = styled.span`
  margin-left: 8px;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1; /* Fill remaining space */
`;

const StyledForm = styled.form`
  background-color: #fff; /* Białe tło */
  padding: 40px; /* Większy padding */
  border-radius: 20px; /* Większe zaokrąglenie */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Mocniejszy cień */
  width: 400px; /* Większa szerokość */
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px; /* Większy odstęp */
  color: #333; /* Ciemniejszy kolor */
  font-size: 2em;
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: 20px; /* Większy odstęp */
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px; /* Większy odstęp */
  font-weight: bold;
  color: #555; /* Ciemniejszy kolor */
  font-size: 0.95em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px; /* Większy padding */
  border: 2px solid #eee; /* Jaśniejsza ramka */
  border-radius: 8px; /* Większe zaokrąglenie */
  box-sizing: border-box;
  margin-top: 4px;
  font-size: 1em;
  //border-color: #787878;
  border-color: #bbb;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border: 1px solid black; /* Ciemniejsza ramka */
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); /* Dodatkowy cień */
  }
`;

const StyledButton = styled.button`
  background-color: #4caf50; /* Nowy kolor */
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
  font-size: 1.1em;

  &:hover {
    background-color: #388e3c; /* Ciemniejszy kolor po najechaniu */
    transform: scale(1.02); /* Efekt powiększenia */
  }
`;

const Message = styled.p`
  margin-top: 20px; /* Większy odstęp */
  text-align: center;
  font-size: 1em;
  color: #444;
`;

function AuthForm({
  title,
  fields,
  submitButtonText,
  onSubmit,
  message,
  setMessage,
  apiEndpoint,
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
        setVerificationStatus("Email został pomyślnie zweryfikowany!");
        setShowModal(false);
        console.log("handleVerifyToken: Email zweryfikowany.");
        navigate("/login");
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
    <MainContainer>
      <Header>
        <HeaderText>{title}</HeaderText>
      </Header>
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledTitle>{title}</StyledTitle>
          {fields.map((field, index) => (
            <FormGroup key={index}>
              <StyledLabel htmlFor={field.name}>{field.label}:</StyledLabel>
              <StyledInput
                type={field.type}
                name={field.name}
                value={fieldValues[field.name]}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required}
              />
            </FormGroup>
          ))}
          <StyledButton type="submit">{submitButtonText}</StyledButton>
          {message && <Message>{message}</Message>}
          {verificationStatus && <Message>{verificationStatus}</Message>}
        </StyledForm>
      </FormContainer>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Weryfikacja Email</h2>
          <p>Email: {userEmail}</p>
          <StyledInput
            type="text"
            placeholder="Wprowadź token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <StyledButton onClick={handleVerifyToken}>Zweryfikuj</StyledButton>
          {verificationStatus && <Message>{verificationStatus}</Message>}
        </Modal>
      )}
    </MainContainer>
  );
}

export default AuthForm;
