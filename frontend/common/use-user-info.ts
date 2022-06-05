import { FlowTeaInfo, useFcl } from "./FclContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function useUserInfo (address: undefined | string) {
  const { getInfo } = useFcl();
  const [data, setData] = useState<FlowTeaInfo | null>(null);
  const [error, setError] = useState(null);

  async function fetch () {
    if (!address) return;
    try {
      setData(await getInfo(address));
    } catch (e: any) {
      console.error(e)
      toast.error("Couldn't retrieve user info!");
      setError(e);
    }
  }

  useEffect(() => {
    fetch()
  }, [address])


  return { data, error, fetch }
}
