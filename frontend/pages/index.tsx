import type { NextPage } from "next";
import Image from "next/image";
import styled from "styled-components";
import SearchInput from "../components/SearchInput";
import { useState } from "react";
import { useFlow } from "../cadence/fcl";

// components
import RoundButton from "../components/RoundButton";

// resources
import blobImage from "../public/images/blob.svg";
import teaCupImage from "../public/images/flow-tea-cup.svg";

// --LANDING--SECTION--
/* BIG INPUT */
const BigNameInputWrapper = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 10rem;
  opacity: 1;

  display: flex;
  direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0.8rem 0.8rem 2rem;

  &:focus-within {
    outline: auto;
  }
  max-width: 96vw;

  box-sizing: border-box;
`;
const BigInputText = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: 1.3rem;
  line-height: 2rem;

  letter-spacing: 0px;
  color: ${(props) => props.theme.colors.mainDark};
  opacity: 1;

  @media only screen and (max-width: 700px) {
    display: none;
  }
`;
const BigInputInput = styled.input`
  color: ${(props) => props.theme.colors.mainDark};
  border: none;
  font-size: 1.3rem;
  line-height: 2rem;
  font-weight: bold;
  letter-spacing: 0px;
  padding: 0;
  flex-grow: 1;

  padding: 0 0.5rem;

  &::placeholder {
    font-size: 1.3rem;
    line-height: 2rem;
    font-weight: bold;

    letter-spacing: 0px;
    color: ${(props) => props.theme.colors.mainDark};
    opacity: 0.22;
  }

  &:focus {
    outline: none;
  }
`;
const BigInputButtonWrapper = styled.div`
  align-self: end;
`;
const BigInput = () => {
  const [name, setName] = useState("");

  return (
    <BigNameInputWrapper>
      <BigInputText>buymeaflowtea.com/</BigInputText>
      <BigInputInput
        type="text"
        placeholder="your name"
        value={name}
        onChange={(evt) => setName(evt.target.value)}
      />
      <BigInputButtonWrapper>
        <RoundButton href={`/register?name=${name}`}>
          Create your page
        </RoundButton>
      </BigInputButtonWrapper>
    </BigNameInputWrapper>
  );
};
/* BIG INPUT */

const SmallText = styled.div`
  font-size: 1rem;
  letter-spacing: 0px;
  opacity: 0.88;
  padding: 3rem;
`;

const CenterTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  @media only screen and (min-width: 850px) {
    width: 60vw;
    max-width: calc(${(props) => props.theme.layout.max_width} - 10rem);
  }
  z-index: 2;
`;

const BigText = styled.div`
  font-size: 4rem;
  line-height: 6rem;
  font-weight: 800;
  opacity: 0.86;
  text-align: center;
  padding: 3rem;

  @media only screen and (max-width: 1300px) {
    font-size: 3rem;
    line-height: 5rem;
  }
`;
const LandingSection = styled.div`
  background-color: #e5e5f7;
  background-image: repeating-radial-gradient(
      circle at 0 0,
      transparent 0,
      #e5e5f7 30px
    ),
    repeating-linear-gradient(#aca3f855, #aca3f8);

  height: 100vh;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
`;
// --LANDING--SECTION--
// --Hey--You--Section--
const HeyYouSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100vw;
  background: ${(props) => props.theme.colors.lightViolet};
`;
const HeyYouSection = styled.div`
  max-width: ${({ theme }) => theme.layout.max_width};
  padding: 10rem ${({ theme }) => theme.layout.mobile_padding};

  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

const HeyYouColumn = styled.div`
  flex: 1;
`;

const HeyYouBlobColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: end;
  @media only screen and (max-width: 1200px) {
    justify-content: center;
  }
`;

const SmallRedText = styled.div`
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 35px;
  padding-top: 2rem;

  color: ${(props) => props.theme.colors.primary};
`;

const BigHeading = styled.div`
  font-weight: 900;
  font-size: 6rem;
  line-height: 9rem;
  padding-bottom: 3rem;
`;

const BoldNormal = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: bold;
  padding-bottom: 2rem;
`;
const NormalText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
  padding-bottom: 2rem;
`;
const BlobImageWrapper = styled.div`
  height: 100%;
  max-width: 35rem;
  aspect-ratio: 382.823/409.499;
  position: relative;
`;
const TeaCupsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 3rem;

  @media only screen and (max-width: 1200px) {
    position: initial;
    margin: 3rem 0;
  }
`;
const TeaCupRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const TeaCup = styled.div`
  position: relative;
  width: 5rem;
  height: 5rem;
  margin-right: 0.7rem;
`;
// --Hey--You--Section--

const Home: NextPage = () => {
  const flow = useFlow({});

  function register() {
    //flow.tx.register(username).then(console.log).catch(console.error);
  }

  return (
    <>
      <LandingSection>
        <CenterTitleBox>
          <BigText>Let your appreciators buy you a Flow tea.</BigText>
          <BigInput />
          <SmallText>It is free and quick!</SmallText>
        </CenterTitleBox>
      </LandingSection>
      <HeyYouSectionContainer>
        <HeyYouSection>
          <HeyYouColumn>
            <SmallRedText>WHAT IS FLOW TEA?</SmallRedText>
            <BigHeading>Hey you!</BigHeading>
            <BoldNormal>
              You have built something really awesome or designed something
              really beautiful!
            </BoldNormal>
            <NormalText>
              Wouldn’t be nice if everyone, who appreciate your work, would buy
              you a tea? Now they can! They are not your <s>customers</s>, they
              are your appreciators 💜
            </NormalText>
          </HeyYouColumn>
          <HeyYouBlobColumn>
            <BlobImageWrapper>
              <Image src={blobImage} layout="fill" />
              <TeaCupsWrapper>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <TeaCupRow>
                      {[...Array(4)].map((__, j) => (
                        <TeaCup>
                          <Image src={teaCupImage} layout="fill" />
                        </TeaCup>
                      ))}
                    </TeaCupRow>
                  ))}
                </div>
              </TeaCupsWrapper>
            </BlobImageWrapper>
          </HeyYouBlobColumn>
        </HeyYouSection>
      </HeyYouSectionContainer>
      <UnderConstructionContainer>
        <UnderConstruction>⚠️ Site is under construction ⚠️</UnderConstruction>
      </UnderConstructionContainer>
    </>
  );
};

const UnderConstructionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100vw;
  background: ${(props) => props.theme.colors.yellow};
`;

const UnderConstruction = styled.div`
  max-width: ${({ theme }) => theme.layout.max_width};
  padding: 10rem ${({ theme }) => theme.layout.mobile_padding};

  font-size: 3rem;
`;

export default Home;
