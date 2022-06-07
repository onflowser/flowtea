import { FlowTeaInfo, useFcl } from "./FclContext";
import useSWR from "swr";
import { useEffect, useState } from "react";


export function useUserInfo (userId: string) {
  const {user} = useFcl();
  const isAddress = userId?.startsWith("0x");
  const { getInfo, getAddress } = useFcl();
  const {
    data: address,
    error: addressError,
  } = useSWR(`/lookup/${userId}`, () => isAddress ? userId : getAddress(userId));
  const isSelf = address === user?.addr;
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
    isLoading: address === undefined || donations === undefined || info === undefined,
    isSelf,
    info,
    donations: donations?.to,
    infoError,
    addressError,
    donationsError,
    isValidatingDonations
  }
}
