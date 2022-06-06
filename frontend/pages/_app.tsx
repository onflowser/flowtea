import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import DefaultLayout from "../components/layouts/LandingLayout";
import { GlobalStyle } from "../components/GlobalStyles";
import { FclProvider } from "../common/FclContext";
import { Toaster } from "react-hot-toast";
import { theme } from "../common/theme";
import { SWRConfig } from "swr";


function App ({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const Layout = Component.Layout || DefaultLayout;

  return (
    <>
      <Toaster/>
      <GlobalStyle/>
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            refreshInterval: 3000,
            fetcher: (resource, init) =>
              fetch(process.env.NEXT_PUBLIC_API_HOST + resource, init)
                .then(res => res.json())
          }}
        >
          <FclProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </FclProvider>
        </SWRConfig>
      </ThemeProvider>
    </>
  );
}

export default App;
