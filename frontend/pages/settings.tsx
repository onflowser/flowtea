import LoginLayout from "../components/layouts/LoginLayout";
import { PrimaryButton } from "../components/PrimaryButton";
import { Input, TextArea } from "../components/Input";
import { useFcl } from "../common/FclContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { wait } from "../common/utils";

export default function Settings () {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, update, fetchCurrentUserInfo, info, isRegistered } = useFcl();
  const { query } = useRouter();
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isRegistered) {
      setSlug(query.slug as string)
    }
  }, [isRegistered, query])

  useEffect(() => {
    if (info) {
      setName(info.name)
      setDescription(info.description);
    }
  }, [info])

  async function onRegister() {
    if (!slug) {
      toast.error("Please enter your identifier!")
      return;
    }
    try {
      await register(slug, name, description);
      while (true) {
        console.log("fetching")
        await wait(500);
        if (await fetchCurrentUserInfo()) {
          console.log('stopping')
          break;
        }
      }
      await router.replace("/settings")
      toast.success("Registered!")
    } catch (e: any) {
      toast.error(e.toString())
    }
  }

  async function onUpdate() {
    try {
      await update(name, description);
      toast.success("Info updated!")
    } catch (e: any) {
      toast.error(e.toString())
    }
  }

  async function onSubmit () {
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
    setIsSubmitting(true);
    try {
      if (isRegistered) {
        await onUpdate();
      } else {
        await onRegister();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="profile-settings">
        {!isRegistered && <h3>Create your profile</h3>}

        {/* TODO: add profile photo functionality */}
        {/*<img src="/images/add-profile-photo.svg" alt=""/>*/}
        {/*<p>Drop image to change photo</p>*/}

        <div className="profile-fields">
          <Input
            label="Identifier"
            placeholder="Identifier"
            value={slug}
            disabled={isRegistered}
            onInput={e => setSlug(e.currentTarget.value)}
          />
          <Input
            label="Name"
            placeholder="Name"
            value={name}
            onInput={e => setName(e.currentTarget.value)}
          />
          <TextArea
            label="About"
            placeholder="Hello! I just created Buy me a Flow tea profile..."
            value={description}
            onInput={e => setDescription(e.currentTarget.value)}
          />
        </div>

        <PrimaryButton
          style={{
            marginTop: 50,
            width: '100%',
            maxWidth: 'unset'
          }}
          isLoading={isSubmitting}
          onClick={onSubmit}
        >
          {isRegistered ? 'Save' : 'Continue'}
        </PrimaryButton>

      </div>
    </>
  )
}

Settings.Layout = LoginLayout;
