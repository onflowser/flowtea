import styled from "styled-components";

export default function SearchInput() {
  return (
    <Container>
      flowtea.com/
      <Input placeholder="your username" />
      <Button>Search</Button>
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding-left: ${({ theme }) => theme.gutter.md};
`;

const Input = styled.input`
  border: none;
  outline: none;
  height: 40px; // should be equal to 100% of container
`;

const Button = styled.button`
  border-radius: 30px;
  border: none;
  cursor: pointer;
  height: 30px;
  padding: 0 ${({ theme }) => theme.gutter.md};
  margin: ${({ theme }) => theme.gutter.xs};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
`;
