import ProfileLayout from "../components/layouts/ProfileLayout";
import Profile from "./profile";
import { useRouter } from "next/router";
import UserProfile from "../components/UserProfile";

export default function OtherUserProfile() {
  const router = useRouter();

  return <UserProfile userId={router.query.slug as string} />
}

Profile.Layout = ProfileLayout;

