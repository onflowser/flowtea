import type { NextPage } from 'next'
import styled from "styled-components";
import SearchInput from "../components/SearchInput";
import { useState } from "react";
import { useFlow } from "../cadence/fcl";

const Home: NextPage = () => {
  const [username, setUsername] = useState('');
  const flow = useFlow({});

  function register() {
    flow.tx.register(username).then(console.log).catch(console.error)
  }

  return (
    <>
      <LandingSection>
        <h1>Let your appreciators buy you a Flow Tea (or a floatie)</h1>
        <SearchInput onClick={register} onInput={e => setUsername(e.target.value)} />
      </LandingSection>
      <HelloSection>
        <div>
          <h2>Hey you!</h2>
          <p>Have you build or designed something awesome ?</p>
          <p>Wouldn&apos;t it be nice if everyone, who appreciate your work, would buy you a tea ? Now they can! They are not your customers, but your appreciators!</p>
        </div>
        <div>
          ---
        </div>
      </HelloSection>
    </>
  )
}

const LandingSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 100px 20%;
  background: ${({ theme }) => theme.colors.grey};
  h1 {
    text-align: center;
  }
`;

const HelloSection = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.gutter.xl} 10%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  div {
    flex: 1;
  }
`;

export default Home
