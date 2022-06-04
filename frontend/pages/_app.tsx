import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import DefaultLayout from "../components/layouts/LandingLayout";
import { GlobalStyle } from "../components/GlobalStyles";
import { FclProvider } from "../common/FclContext";

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

  // @ts-ignore
  const Layout = Component.Layout || DefaultLayout;

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <FclProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </FclProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
