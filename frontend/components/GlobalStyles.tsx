import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    background:#141C2D;
    color:#141C2D;
  }

  a {
    color:#fe6f6f;
    text-decoration: none;
  }

  :root {

    /* =============================================== COLORS */
    --light-violet-color:#e8e5fc;
    --dark-violet-color: #9e94f7;
    --secondary-color: #fe6f6f;
    --placeholder-text-color: #91959d;
    --main-dark-color: #141c2d;
    --dark-blue-color: #294269;
    --active-field-color: #faea95;
    --error-color: #e04f5f;
  }


  html, body {
    background-color: #f6f6f6;
    font-family: 'Poppins', sans-serif;
    line-height: 1.8em;
    color: var(--main-dark-color);
    overflow-x: hidden;
  }

  h6 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  h3 {
    font-size: 48px;
    text-align: center;
    line-height: 1.2em;
  }

  .nav-logo-only {
    background-color: #fff;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav-logo-only img {
    max-width: 150px;
    width: 100%;
  }

  .nav-profile {
    padding: 0px 20px 0px 20px;
  }

  .nav-profile-content {
    max-width: 1360px;
    width: 99%;
    margin: 0 auto;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .nav-profile-content-left {
    max-width: 80px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .profile-photo-small {
    max-width: 35px;
    width: 100%;
  }

  .sign-up, .log-in {
    padding: 0px 30px 0px 30px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
    max-width: 450px;
  }

  .log-in-text a {
    color: var(--secondary-color);
    text-decoration: none;
  }

  .log-in-text {
    margin-top: 20px;
    font-size: 14px;
  }

  .profile-settings {
    margin: 0 auto;
    text-align: center;
    max-width: 450px;
    padding: 0px 20px 0px 20px;
    margin-top: 100px;
    margin-bottom: 100px;
  }

  .profile-settings img {
    max-width: 150px;
    width: 100%;
  }


  .profile-fields {
    display: flex;
    flex-direction: column;
    align-items: left;
    text-align: left;
  }

  .profile-settings p {
    font-size: 12px;
    color: var(--placeholder-text-color);
  }

  textarea {
    font-family: 'Poppins', sans-serif;
  }

  textarea:focus, input:focus {
    outline: solid 1px var(--dark-violet-color);
  }

  .nav-profile {
    background-color: #fff;
  }

  .dark-background-profile {
    background-color: var(--main-dark-color);
    height: 200px;
  }

  .profile-photo-main-wrapper {
    margin: 0 auto;
    text-align: center;
    margin-top: -80px;
    margin-bottom: 120px;
  }

  .profile-photo-main-wrapper img {
    max-width: 150px;
    width: 100%;
    margin-bottom: 20px;
  }

  .profile-photo-main-wrapper h3 {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .profile-content-wrapper {
    max-width: 1360px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
    margin-bottom: 100px;
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
  }


  .buy-flow-tea-form {
    background-color: var(--main-dark-color);
    height: 600px;
    width: 55%;
    border-radius: 1%;
  }


  /* =============================================== mobile */

  @media (max-width: 450px) {
    h3 {
      font-size: 30px;
    }

    h6 {
      font-size: 16px;
    }

    .profile-settings img {
      max-width: 100px;
      width: 100%;
    }
  }

  html {
    @media only screen and (max-width: 900px) {
      font-size: 0.8rem;
    }
    @media only screen and (max-width: 500px) {
      font-size: 0.6rem;
    }
  }
`;
