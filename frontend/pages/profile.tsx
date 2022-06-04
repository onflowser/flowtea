import ProfileLayout from "../components/layouts/ProfileLayout";
import { useFcl } from "../common/FclContext";
import styled from "styled-components";

export default function Profile () {
  const { info } = useFcl();

  return (
    <Container>
      <div className="dark-background-profile"></div>

      <div className="profile-photo-main-wrapper">
        <img src="/images/profile-photo-main.svg" alt=""/>
        <h3 className="profile-name">{info?.name}</h3>
      </div>

      <div className="profile-content-wrapper">
        <div className="bio-and-transactions">
          <div className="bio-profile">
            <h5>About {info?.name}</h5>

            <p>
              {info?.description}
            </p>

          </div>

          {/* TODO: use real transactions */}
          <Transaction teaCount={1} fromAddress="0x0f44940e7dd31e6b"/>
          <Transaction teaCount={5} fromAddress="0x0f44940e7dd31e6b"/>
          <Transaction teaCount={100} fromAddress="0x0f44940e7dd31e6b"/>

        </div>
        <div className="buy-flow-tea-form">
          TODO: add content
        </div>
      </div>
    </Container>
  )
}

function Transaction ({
  teaCount,
  fromAddress
}: { teaCount: number, fromAddress: string }) {
  return (
    <div className="transactions-profil-details">
      <div className="tea-count">
        <img src="/images/flow-tea-cup.svg" alt=""/>
        <h4>x</h4>
        <h4 className="tea-count-number">{teaCount}</h4>
      </div>
      <h6 className="address-id">Appreciated by {fromAddress}</h6>
    </div>
  )
}

const Container = styled.div`
  .profile-photo-main-wrapper h3 {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .profile-content-wrapper {
    max-width: 1200px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0 auto 100px;
  }
  
  .profile-content-wrapper > *:first-child {
    margin-right: 30px;
  }

  .profile-content-wrapper h5 {
    font-size: 24px;
    color: var(--main-dark-color);
    font-weight: 700;
  }

  .bio-and-transactions {
    max-width: 40%;
  }

  .bio-profile {
    padding: 50px 30px 50px 30px;
    border: solid 2px #D9D9D9;
    margin-bottom: 50px;
    border-radius: 1%;
  }

  .bio-link {
    color: var(--secondary-color);
    text-decoration: none;
    font-weight: 500;
  }

  .transactions-profil-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    border: solid 2px #D9D9D9;
    margin-bottom: 20px;
    border-radius: 1%;

  }

  .tea-count {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 80px;
    width: 100%;
    color: var(--dark-violet-color);
  }

  .tea-count img {
    max-width: 30px;
    width: 100%;
  }

  .address-id {
    color: var(--placeholder-text-color);
    font-size: 12px;
    letter-spacing: 0.05em;
    margin-left: 20px;
  }


  .buy-flow-tea-form {
    background-color: var(--main-dark-color);
    height: 600px;
    width: 55%;
    border-radius: 1%;
  }
`;

Profile.Layout = ProfileLayout;
