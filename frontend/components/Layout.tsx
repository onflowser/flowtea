import { ReactElement } from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

// resources
import bmft_logo from "../public/images/logo-BMFT-horizontal.svg";
import bmft_logo_ver from "../public/images/logo-BMFT-vertical.svg";

// components
import RoundButton from "./RoundButton";

type Props = {
  children: ReactElement;
};

const LinkText = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.mainDark};
  padding: 0 1em;

  font-weight: bold;
  font-size: 16px;
  line-height: 25px;
`;

export default function Layout({ children }: Props) {
  return (
    <>
      <Navigation>
        <NavInner>
          <Image src={bmft_logo} />
          <NavigationRightButtons>
            <Link href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} passHref>
              <LinkText style={{ paddingRight: `2em` }}>
                HOW DOES IT WORK?
              </LinkText>
            </Link>
            <Link href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} passHref>
              <LinkText>Log in</LinkText>
            </Link>
            <RoundButton href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}>
              Sign up
            </RoundButton>
          </NavigationRightButtons>
        </NavInner>
      </Navigation>
      <Main>{children}</Main>
      <Footer>
        <FooterImageWrapper>
          <Image src={bmft_logo_ver} />
        </FooterImageWrapper>
        <FooterText>
          Buy me a FLOW tea is created and supported by{" "}
          <Link href={"https://github.com/onflowser"}>
            <a target="_blank">Flowser team</a>
          </Link>
        </FooterText>
      </Footer>
    </>
  );
}

const Navigation = styled.nav`
  position: absolute;
  width: 100vw;
  top: 0;

  display: flex;
  justify-content: center;
`;

const NavInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.max_width};
  padding: ${({ theme }) => theme.layout.mobile_padding};
  height: ${({ theme }) => theme.layout.navbar_height};

  z-index: 2;
`;

const NavigationRightButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
`;

const Main = styled.main``;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.gutter.xl};
  color: ${({ theme }) => theme.colors.white};
  padding: 8em 0;
`;

const FooterImageWrapper = styled.div`
  margin-bottom: 2em;
`;

const FooterText = styled.a`
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;

  color: ${({ theme }) => theme.colors.white};
`;
