import { FlowTeaInfo, useFcl } from "./FclContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";


export function useUserInfo (address: undefined | string) {
  const { getInfo } = useFcl();
  const [info, setInfo] = useState<FlowTeaInfo | null>(null);
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState(null);

  async function fetchUserInfo () {
    if (!address) return;
    try {
      setInfo(await getInfo(address));
    } catch (e: any) {
      console.error(e)
      toast.error("Couldn't retrieve user info!");
      setError(e);
    }
  }

  async function fetchUserDonations() {
    if (!address) return;
    try {
      const host = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000';
      const response = await fetch(`${host}/users/${address}/donations`);
      const data = await response.json();
      // @ts-ignore
      // TODO: also show transactions that the user donated to other people ?
      setDonations(data.to);
    } catch (e: any) {
      console.error(e)
      toast.error("Couldn't retrieve user donations!");
      setError(e);
    }
  }

  useEffect(() => {
    Promise.allSettled([[
      fetchUserInfo(),
      fetchUserDonations()
  ]])
  }, [address])


  return { info, donations, error, fetchUserInfo, fetchUserDonations }
}
