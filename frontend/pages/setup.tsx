import LoginLayout from "../components/layouts/LoginLayout";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input, TextArea } from "../components/Input";
import { useFcl } from "../common/FclContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Setup () {
  const {register} = useFcl();
  const { query } = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(query.name as string)
  }, [query])

  async function onSubmit() {
    let errors = [];
    if (!name) {
      errors.push("Name is missing!")
    }
    if (!description) {
      errors.push("About is missing!")
    }
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return;
    }
    try {
      await register(name);
      toast.success("Registered!")
      // TODO: redirect to profile, other stuff
    } catch (e: any) {
      toast.error(e.toString())
    }
  }

  return (
    <>
      <div className="profile-settings">
        <h3>Complete your profile</h3>

        <img src="/images/add-profile-photo.svg" alt=""/>

        <p>Drop image to change photo</p>

        <div className="profile-fields">
          <Input
            label="Name"
            placeholder="Name"
            value={name}
            /* @ts-ignore */
            onInput={e => setName(e.target.value)}
          />
          <TextArea
            label="About"
            placeholder="Hello! I just created Buy me a Flow tea profile..."
            value={description}
            /* @ts-ignore */
            onInput={e => setDescription(e.target.value)}
          />
        </div>

        <PrimaryButton
          style={{
          marginTop: 50,
          width: '100%',
          maxWidth: 'unset'
        }}
          onClick={onSubmit}
        >
          Continue
        </PrimaryButton>

      </div>
    </>
  )
}

Setup.Layout = LoginLayout;
