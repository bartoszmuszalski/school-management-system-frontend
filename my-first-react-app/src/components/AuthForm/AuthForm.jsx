import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

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
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #bbb; /* Ciemniejsza ramka */
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
}) {
  const [fieldValues, setFieldValues] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleChange = (e, name) => {
    setFieldValues({ ...fieldValues, [name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await onSubmit(fieldValues);
      if (result && result.message) {
        setMessage(result.message);
        console.log(result.message);
      } else {
        setMessage("Success");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error("Error:", error);
    }
  };

  return (
    <MainContainer>
      <Header>
        <HeaderText>School Management System by J.B.</HeaderText>
      </Header>
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledTitle>{title}</StyledTitle>
          {fields.map((field, index) => (
            <FormGroup key={index}>
              <StyledLabel>{field.label}:</StyledLabel>
              <StyledInput
                type={field.type}
                value={fieldValues[field.name] || ""}
                onChange={(e) => handleChange(e, field.name)}
                required={field.required}
              />
            </FormGroup>
          ))}
          <StyledButton type="submit">{submitButtonText}</StyledButton>
          {message && <Message>{message}</Message>}
        </StyledForm>
      </FormContainer>
    </MainContainer>
  );
}

export default AuthForm;
