import Link from "next/link";
import { useFcl } from "../../common/FclContext";
import styled from "styled-components";
import { ProfileDropdown } from "../ProfileDropdown";

export default function LoginLayout({ children }: any) {
  const {isLoggedIn} = useFcl();

  return (
    <>
      <Navigation>
        <Link href="/">
          <img src="./images/logo-BMFT-vertical.svg" alt=""/>
        </Link>
        <ProfileDropdown style={{position: 'absolute', right: 50}} />
      </Navigation>
      {children}
    </>
  )
}

const Navigation = styled.nav`
  background-color: #fff;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > img {
    max-width: 150px;
    width: 100%;
  }
`;
