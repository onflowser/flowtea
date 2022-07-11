import { ButtonHTMLAttributes, ReactChildren } from "react";
import styled from "styled-components";
import { SpinnerCircular } from "spinners-react";
import { colors } from "../common/theme";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactChildren | string | (string | number)[];
  isLoading?: boolean;
};

// TODO: merge PrimaryLink & PrimaryButton into a single button component
export function PrimaryButton({ isLoading, children, ...props }: Props) {
  return (
    <Container {...props}>
      {isLoading ? (
        <SpinnerCircular
          size={35}
          thickness={100}
          speed={100}
          color={colors.white}
          secondaryColor={colors.grey}
        />
      ) : (
        children
      )}
    </Container>
  );
}

const Container = styled.button`
  background-color: var(--dark-violet-color);
  max-width: 250px;
  height: 60px;
  padding: 0 1.8rem;
  border-radius: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-align: center;
  border: none;
  cursor: pointer;
`;
