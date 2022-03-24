import { ReactElement } from "react";
import styled from "styled-components";

type Props = {
  children: ReactElement;
}

export default function Layout({ children} : Props) {

  return (
    <>
      <Navigation>
        <NavCol>How does it work ?</NavCol>
        <NavCol>Buy Me a Flow Tea</NavCol>
        <NavCol>Log In</NavCol>
      </Navigation>
      <Main>
        {children}
      </Main>
      <Footer>
        <span>Buy Me a Flow Tea</span>
        <span>Created and Supported by Flowser team.</span>
      </Footer>
    </>
  )
}

const Navigation = styled.nav`
  display: flex;
  flex-direction: row;
  height: 100px;
`;

const NavCol = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Main = styled.main``;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.gutter.xl};
  color: ${({ theme }) => theme.colors.white};
`;
