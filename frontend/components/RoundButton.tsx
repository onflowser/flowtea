import Link from "next/link";
import { useRouter } from "next/router";
import { ReactChild } from "react";
import styled from "styled-components";

type Props = {
  children: ReactChild;
  href?: string;
  onClick?: (event: React.MouseEvent) => void;
};

const RoundButtonLink = styled.a`
  background: ${(props) => props.theme.colors.primary} 0% 0% no-repeat
    padding-box;
  border-radius: 10rem;
  opacity: 1;

  text-decoration: none;
  color: ${(props) => props.theme.colors.white};
  display: block;

  padding: 0.8em 1.8em;
  font-weight: bold;
  white-space: nowrap;
`;

const RoundButtonElm = styled.div`
  background: ${(props) => props.theme.colors.primary} 0% 0% no-repeat
    padding-box;
  border-radius: 10rem;
  opacity: 1;
  font-weight: bold;
  white-space: nowrap;
`;

export default function RoundButton({ children, href, onClick }: Props) {
  return href ? (
    <Link href={href} passHref>
      <RoundButtonLink>{children}</RoundButtonLink>
    </Link>
  ) : (
    <RoundButtonElm onClick={onClick}>{children}</RoundButtonElm>
  );
}
