import { ButtonHTMLAttributes, ReactChildren } from "react";
import styled from "styled-components";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactChildren | string;
  isLoading?: boolean;
}

// TODO: merge PrimaryLink & PrimaryButton into a single button component
export function PrimaryButton ({ isLoading, children, ...props }: Props) {
  return (
    <Container {...props}>
      {/* TODO: replace with a proper loader animation */}
      {isLoading ? 'Loading...' : children}
    </Container>
  )
}

const Container = styled.button`
  background-color: var(--dark-violet-color);
  max-width: 250px;
  padding: 1.2em 1.8em;
  border-radius: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-align: center;
  border: none;
  cursor: pointer;
`;
