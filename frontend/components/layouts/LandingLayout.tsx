import { ReactElement } from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

// resources
import bmft_logo from "../../public/images/logo-BMFT-horizontal.svg";
import bmft_logo_ver from "../../public/images/logo-BMFT-vertical-white.svg";

// components
import { PrimaryButton } from "../PrimaryButton";
import { useFcl } from "../../common/FclContext";
import { ProfileDropdown } from "../ProfileDropdown";

type Props = {
  children: ReactElement;
};
export default function LandingLayout({ children }: Props) {
  const { login, logout, isLoggingIn, isLoggingOut, isLoggedIn } = useFcl();

  return (
    <>
      <Navigation>
        <NavInner>
          <Link href={"/"}>
            <a>
              <Image src={bmft_logo} />
            </a>
          </Link>
          <NavigationRightButtons>
            {isLoggedIn ? (
              <>
                <ProfileDropdown style={{ marginRight: 20 }} />
                <PrimaryButton
                  isLoading={isLoggingOut}
                  onClick={() => logout()}
                >
                  Logout
                </PrimaryButton>
              </>
            ) : (
              <>
                {/*<Link href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} passHref>
                  <LinkText style={{ paddingRight: `2em` }}>
                    HOW DOES IT WORK?
            </LinkText>
                </Link>*/}
                <PrimaryButton isLoading={isLoggingIn} onClick={() => login()}>
                  Login with Wallet
                </PrimaryButton>
              </>
            )}
          </NavigationRightButtons>
        </NavInner>
      </Navigation>
      <Main>{children}</Main>
      <Footer>
        <FooterImageWrapper>
          <Image src={bmft_logo_ver} layout="fill" />
        </FooterImageWrapper>
        <FooterText>
          Buy me a FLOW tea is created and supported by{" "}
          <Link href={"https://github.com/onflowser"} passHref>
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
  z-index: 100;
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
  height: 5rem;
  width: 10rem;
  position: relative;
`;

const FooterText = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 21px;
  padding: 2rem;
  text-align: center;

  color: ${({ theme }) => theme.colors.white};
`;
