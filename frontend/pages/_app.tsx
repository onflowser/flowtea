import type { AppProps } from "next/app";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import Layout from "../components/Layout";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const colors = {
  pink: "#db537d",
  orange: "#fe6f6f",
  white: "#fcfcfc",
  grey: "#f3f3f3",
  darkBlue: "#131c2d",
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
    primary: colors.pink,
    secondary: colors.darkBlue,
    ...colors,
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
