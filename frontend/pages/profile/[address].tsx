import ProfileLayout from "../../components/layouts/ProfileLayout";
import Profile from "./index";
import { useRouter } from "next/router";
import UserProfile from "../../components/UserProfile";

export default function OtherUserProfile() {
  const router = useRouter();

  return <UserProfile receiverAddress={router.query.address as string} />
}

Profile.Layout = ProfileLayout;

