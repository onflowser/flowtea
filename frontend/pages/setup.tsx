import LoginLayout from "../components/layouts/LoginLayout";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input } from "../components/Input";
import { useFcl } from "../common/FclContext";

export default function Setup () {
  const {} = useFcl();

  return (
    <>
      <div className="profile-settings">
        <h3>Complete your profile</h3>

        <img src="/images/add-profile-photo.svg" alt=""/>

        <p>Drop image to change photo</p>

        <div className="profile-fields">
          <Input label="Name" placeholder="Name" />
          <Input label="About" placeholder="Hello! I just created Buy me a Flow tea profile..." textarea />
        </div>

        <PrimaryButton style={{
          marginTop: 50,
          width: '100%',
          maxWidth: 'unset'
        }}>
          Continue
        </PrimaryButton>

      </div>
    </>
  )
}

Setup.Layout = LoginLayout;
