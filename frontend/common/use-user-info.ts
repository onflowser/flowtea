import { useFcl } from "./user-context";
import useSWR from "swr";
import { FlowTeaInfo, isUserIdAddress } from "./fcl-service";

/**
 * @param userId Can either be a handle or account address.
 */
export function useUserInfo(userId: string | undefined) {
  const { user } = useFcl();
  const isAddress = isUserIdAddress(userId);
  const { getInfo, getAddress, getHandle } = useFcl();
  const { data: address, error: addressError } = useSWR(
    () => (!userId ? null : `/lookup/${userId}`),
    () => (isAddress ? userId : userId && getAddress(userId))
  );
  const { data: handle, error: handleError } = useSWR(
    () => (!userId ? null : `/reverse-lookup/${userId}`),
    () => (isAddress ? userId && getHandle(userId) : userId)
  );
  const {
    data: serverSideInfo,
    error: serverSideInfoError,
    isValidating: isValidatingServerSideInfo,
    mutate: refetchServerSideInfo,
  } = useSWR(address ? `/users/${address}` : null);
  const {
    data: info,
    error: infoError,
    mutate: refetchInfo,
  } = useSWR<FlowTeaInfo | null>(address ? `/flow/${address}` : null, () =>
    address ? getInfo(address) : null
  );
  const isSelf = address === user?.addr;

  return {
    isLoading:
      address === undefined ||
      serverSideInfo === undefined ||
      info === undefined,
    address,
    profilePhotoUrl: serverSideInfo?.user?.profilePhotoUrl ?? null,
    refetchServerSideInfo,
    handle,
    isSelf,
    info,
    donations: {
      to: serverSideInfo?.to,
      from: serverSideInfo?.from,
    },
    infoError,
    handleError,
    refetchInfo,
    addressError,
    serverSideInfoError,
    isValidatingServerSideInfo,
  };
}
