import { useFcl } from "./FclContext";
import useSWR from "swr";
import { FlowTeaInfo, isUserIdAddress } from "./fcl-service";


/**
 * @param userId Can either be a handle or account address.
 */
export function useUserInfo (userId: string | undefined) {
  const { user } = useFcl();
  const isAddress = isUserIdAddress(userId);
  const { getInfo, getAddress, getHandle } = useFcl();
  const {
    data: address,
    error: addressError,
  } = useSWR(() => !userId ? null : `/lookup/${userId}`, () => isAddress ? userId : userId && getAddress(userId));
  const {
    data: handle,
    error: handleError,
  } = useSWR(() => !userId ? null : `/reverse-lookup/${userId}`, () => isAddress ? userId && getHandle(userId) : userId);
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
    handle,
    isSelf,
    info,
    donations: donations?.to,
    infoError,
    handleError,
    refetchInfo,
    addressError,
    donationsError,
    isValidatingDonations
  }
}
