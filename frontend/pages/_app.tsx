import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import DefaultLayout from "../components/layouts/LandingLayout";
import { GlobalStyle } from "../components/GlobalStyles";
import { FclProvider } from "../common/FclContext";
import { Toaster } from "react-hot-toast";
import { theme } from "../common/theme";



function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const Layout = Component.Layout || DefaultLayout;

  return (
    <>
      <Toaster />
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
