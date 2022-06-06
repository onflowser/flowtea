import { FlowTeaInfo, useFcl } from "./FclContext";
import useSWR from "swr";


export function useUserInfo (address: undefined | string) {
  const { getInfo } = useFcl();
  const {
    data: donations,
    error: donationsError,
    isValidating: isValidatingDonations
  } = useSWR(`/users/${address}/donations`);
  const {
    data: info,
    error: infoError
  } = useSWR<FlowTeaInfo | null>(`/users/${address}`, () => address ? getInfo(address) : null);

  return {
    info,
    donations: donations?.to,
    infoError,
    donationsError,
    isValidatingDonations
  }
}
