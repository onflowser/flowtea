import LoginLayout from "../components/layouts/LoginLayout";

export default function Setup () {
  return (
    <>

      <div className="profile-settings">
        <h3>Complete your profile</h3>

        <img src="/images/add-profile-photo.svg" alt=""/>

        <p>Drop image to change photo</p>


        <div className="profile-fields">
          <h6>Name</h6>
          <input className="white-field" type="text" name="name"
                 placeholder="Name"/>
          <h6>Buy me a FLOW tea link</h6>
          <input className="white-field" type="text" name="name"
                 placeholder="buymeaflowtea/name"/>
          <h6>About</h6>
          <textarea className="white-field" name="bio" rows={4}
                    placeholder="Hello! I just created Buy me a Flow tea profile..."/>
          <h6>FLOW Address</h6>
          <input className="white-field" type="text" name="name"
                 placeholder="0xdbe1acb46029e11a"/>

        </div>

        <div className="violet-button violet-button-margin-top">
          <a href="">Continue</a>
        </div>

      </div>

    </>
  )
}

Setup.Layout = LoginLayout;
