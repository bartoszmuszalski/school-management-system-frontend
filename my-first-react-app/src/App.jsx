import React, { useState } from "react";
import GlobalStyle from "./GlobalStyle";
import AuthForm from "./components/AuthForm/AuthForm";

function App() {
  const [message, setMessage] = useState("");

  return (
    <div style={{ minHeight: "100vh" }}>
      <GlobalStyle />
      <AuthForm
        title="Rejestracja"
        submitButtonText="Zarejestruj się"
        setMessage={setMessage}
      />
      {/* Wyświetlanie wiadomości tutaj */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
