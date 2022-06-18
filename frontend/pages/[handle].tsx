import ProfileLayout from "../components/layouts/ProfileLayout";
import Profile from "./profile";
import { useRouter } from "next/router";
import UserProfile from "../components/UserProfile";
import { GetServerSideProps } from "next";
import { configureFcl } from "../common/fcl-config";
import {
  FlowTeaInfo,
  getAddress,
  getHandle,
  getInfo,
  isUserIdAddress,
} from "../common/fcl-service";
import MetaTags from "../components/MetaTags";

type Donations = {
  to: any[];
  from: any[];
};

type Data = FlowTeaInfo & {
  handle: string;
  address: string;
  donations: Donations;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  configureFcl();

  const userId = context.query.handle as string;
  const isAddress = isUserIdAddress(userId);
  const address = isAddress
    ? userId
    : await getAddress(userId).catch(() => null);
  if (!address) {
    return {
      notFound: true,
    };
  }
  const handle = isAddress
    ? await getHandle(address).catch(() => null)
    : userId;
  if (!handle) {
    return {
      notFound: true,
    };
  }

  const info = await getInfo(address).catch(() => null);
  if (!info) {
    return {
      notFound: true,
    };
  }
  const donations: Donations = await fetch(
    process.env.NEXT_PUBLIC_API_HOST + `/users/${address}/donations`
  )
    .then((res) => res.json())
    .catch(() => []);
  const data: Data = {
    ...info,
    handle,
    address,
    donations,
  };
  return { props: { data } };
};

export default function OtherUserProfile({ data }: { data: Data }) {
  const router = useRouter();

  // TODO: prerender UserProfile component with above data ^
  const descPrefix = `${data.name} received ${data.donations.to.length} and given ${data.donations.from.length} donations.`;
  return (
    <>
      <MetaTags
        title={`${data.name} (${data.address})`}
        description={`${descPrefix} ${data.description}`}
      />
      <UserProfile userId={router.query.handle as string} />
    </>
  );
}

Profile.Layout = ProfileLayout;
