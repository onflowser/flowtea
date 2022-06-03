import LoginLayout from "../components/layouts/LoginLayout";

export default function Signup () {

  return (
    <>
      <div className="sign-up">
        <h3>Sign up</h3>

        <input className="white-field white-field-100" type="email" name="email"
               placeholder="Email"/>
        <input className="white-field-bottom white-field-100" type="password"
               name="password" placeholder="Password"/>

        <div className="violet-button">
          <a href="">Continue</a>
        </div>

        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <p className="log-in-text">You don't have an account? <a
          href="/sign-up.html">Sign up</a></p>

      </div>
    </>
  )
}

Signup.Layout = LoginLayout;
