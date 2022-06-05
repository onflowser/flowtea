import UserProfile from "../../components/UserProfile";
import { useFcl } from "../../common/FclContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ProfileLayout from "../../components/layouts/ProfileLayout";
import { toast } from "react-hot-toast";

export default function Profile () {
  const router = useRouter();
  const { user, isLoggedIn, isRegistered } = useFcl();

  useEffect(() => {
    if (isLoggedIn !== undefined && !isLoggedIn) {
      router.replace("/")
        .then(() => {
          toast.error("Login to access your profile!")
        })
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isLoggedIn && !isRegistered) {
      router.replace("/settings")
        .then(() => {
          toast.error("You need to register first!")
        })
    }
  }, [isLoggedIn, isRegistered])

  return <UserProfile receiverAddress={user?.addr}/>
}

Profile.Layout = ProfileLayout;
