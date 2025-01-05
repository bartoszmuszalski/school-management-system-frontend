import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(
      to bottom right,
      rgb(106, 156, 119),
      rgb(64, 15, 187)
    );
    font-family: 'Roboto', sans-serif;
    min-height: 100vh;
  }
`;

export default GlobalStyle;
