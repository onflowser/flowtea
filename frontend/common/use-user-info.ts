import { FlowTeaInfo, useFcl } from "./FclContext";
import useSWR from "swr";


export function useUserInfo (userId: string | undefined) {
  const { user } = useFcl();
  const isAddress = userId?.startsWith("0x");
  const { getInfo, getAddress, getSlug } = useFcl();
  const {
    data: address,
    error: addressError,
  } = useSWR(() => !userId ? null : `/lookup/${userId}`, () => isAddress ? userId : userId && getAddress(userId));
  const {
    data: slug,
    error: slugError,
  } = useSWR(() => !userId ? null : `/slug/${userId}`, () => isAddress ? userId && getSlug(userId) : userId);
  const {
    data: donations,
    error: donationsError,
    isValidating: isValidatingDonations
  } = useSWR(address ? `/users/${address}/donations` : null);
  const {
    data: info,
    error: infoError,
    mutate: refetchInfo
  } = useSWR<FlowTeaInfo | null>(address ? `/users/${address}` : null, () => address ? getInfo(address) : null);
  const isSelf = address === user?.addr;

  return {
    isLoading: address === undefined || donations === undefined || info === undefined,
    address,
    slug,
    isSelf,
    info,
    donations: donations?.to,
    infoError,
    slugError,
    refetchInfo,
    addressError,
    donationsError,
    isValidatingDonations
  }
}
