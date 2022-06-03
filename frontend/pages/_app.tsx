import type { AppProps } from "next/app";
import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import Layout from "../components/Layout";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    background:#141C2D;
    color:#141C2D;
  }

  a {
    color:#fe6f6f;
    text-decoration: none;
  }
`;

const colors = {
  pink: "#db537d",
  orange: "#fe6f6f",
  white: "#fff",
  grey: "#f3f3f3",
  darkBlue: "#131c2d",
  mainDark: "#141C2D",
  lightViolet: "#E8E5FC",
  yellow: "#feff78",
};

const theme = {
  gutter: {
    xs: "5px",
    sm: "10px",
    md: "15px",
    lg: "20px",
    xl: "25px",
  },
  colors: {
    primary: colors.orange,
    secondary: colors.darkBlue,
    ...colors,
  },
  // maybe only for testing
  layout: {
    navbar_height: "200px",
    max_width: "1200px",
    mobile_padding: "2rem",
  },
};

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default App;
