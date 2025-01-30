import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: white; /* Changed from gradient to white */
    font-family: 'Roboto', sans-serif;
    min-height: auto;
  }
`;

export default GlobalStyle;
