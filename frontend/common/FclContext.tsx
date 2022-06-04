import React, {
  ReactChild,
  useContext,
  useEffect,
  useState
} from "react";
import { useRouter } from "next/router";


// @ts-ignore
import * as fcl from '@onflow/fcl';
// @ts-ignore
import * as t from "@onflow/types";

// cadence files
// @ts-ignore
import getFlowBalanceCode from "../cadence/scripts/get-flow-balance.cdc";
// @ts-ignore
import getIsRegisteredCode from "../cadence/scripts/is-registered.cdc";
// @ts-ignore
import getInfoCode from "../cadence/scripts/get-info.cdc";
// @ts-ignore
import donateFlowCode from "../cadence/transactions/donate.cdc";
// @ts-ignore
import registerFlowCode from "../cadence/transactions/register.cdc";
// @ts-ignore
import updateFlowCode from "../cadence/transactions/update.cdc";

type TxResult = { transactionId: string, status: any };

type FclContextProps = {
  user: null | FlowUser;
  info: null | FlowTeaInfo;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isLoggedIn: boolean;
  isRegistered: boolean;
  login: () => void;
  logout: () => void;
  donateFlow: (amount: number, receiverAddress: string) => Promise<TxResult>;
  getFlowBalance: (address: string) => Promise<number>
  register: (name: string, description: string) => Promise<TxResult>
  update: (name: string, description: string) => Promise<TxResult>
}

const defaultTxResult = { transactionId: '', status: '' };

type FlowUser = {
  addr: string
  cid: string
  expiresAt: null
  f_type: "USER"
  f_vsn: string
  loggedIn: true
  services: any[]
}

type FlowTeaInfo = {
  name: string;
  description: string;
}

const defaultValue: FclContextProps = {
  user: null,
  info: null,
  isLoggingIn: false,
  isLoggingOut: false,
  isLoggedIn: false,
  isRegistered: false,
  login: () => null,
  logout: () => null,
  donateFlow: () => Promise.resolve(defaultTxResult),
  getFlowBalance: () => Promise.resolve(0),
  register: () => Promise.resolve(defaultTxResult),
  update: () => Promise.resolve(defaultTxResult)
}

const FclContext = React.createContext(defaultValue);

export function FclProvider ({ config = {}, children } : {config?: object, children: ReactChild}) {
  const router = useRouter();
  const [user, setUser] = useState<FlowUser|null>(null);
  const [info, setInfo] = useState<FlowTeaInfo|null>(null);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fcl.config({
      "env": "local",
      "accessNode.api": "http://localhost:8080",
      "discovery.wallet": "http://localhost:8701/fcl/authn",
      "0xFLOWTOKENADDRESS": "0x0ae53cb6e3f42a79",
      "0xFUNGIBLETOKENADDRESS": "0xee82856bf20e2aa6",
      "0xTEADONATIONADDRESS": "0xf8d6e0586b0a20c7",
      "0xTEAPROFILEADDRESS": "0xf8d6e0586b0a20c7",
      ...config
    })
  }, [config])

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  useEffect(() => {
    if (user?.addr) {
      getIsRegistered(user.addr).then(setIsRegistered)
      getInfo(user.addr).then(setInfo)
    }
  }, [user])

  async function getFlowBalance (address: string) {
    return fcl.send([
      fcl.script(getFlowBalanceCode),
      fcl.args([
        fcl.arg(address, t.Address),
      ])
    ]).then(fcl.decode)
  }

  async function getIsRegistered (address: string) {
    return fcl.send([
      fcl.script(getIsRegisteredCode),
      fcl.args([
        fcl.arg(address, t.Address),
      ])
    ])
      .then(fcl.decode)
      .catch((e: any) => {
        console.error(e);
        return false
      }) as Promise<boolean>
  }

  async function getInfo (address: string) {
    return fcl.send([
      fcl.script(getInfoCode),
      fcl.args([
        fcl.arg(address, t.Address),
      ])
    ])
      .then(fcl.decode)
      .catch((e: any) => {
        console.error(e)
        return null;
      }) as Promise<FlowTeaInfo|null>
  }

  async function register (name: string, description: string) {
    return sendTransaction(registerFlowCode, [
      fcl.arg(name, t.String),
      fcl.arg(description, t.String),
    ])
  }

  async function update (name: string, description: string) {
    return sendTransaction(updateFlowCode, [
      fcl.arg(name, t.String),
      fcl.arg(description, t.String),
    ])
  }

  function donateFlow (amount: number, receiverAddress: string) {
    return sendTransaction(donateFlowCode, [
      fcl.arg(amount, t.UFix64),
      fcl.arg(receiverAddress, t.Address),
    ])
  }

  async function sendTransaction (cadence: string, args: any[]) {
    const transactionId = await fcl.mutate({
      cadence,
      args: () => args,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50,
    });

    return {
      transactionId,
      status: await fcl.tx(transactionId).onceSealed(),
    };
  }

  async function logout () {
    setLoggingOut(true);
    try {
      return fcl.unauthenticate();
    } finally {
      setLoggingOut(false);
    }
  }

  async function login () {
    setLoggingIn(true);
    try {
      return fcl.authenticate();
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <FclContext.Provider value={{
      getFlowBalance,
      donateFlow,
      login,
      logout,
      update,
      register,
      user,
      info,
      isRegistered,
      isLoggedIn: Boolean(user?.loggedIn),
      isLoggingIn,
      isLoggingOut
    }}>
      {children}
    </FclContext.Provider>
  )
}

export function useFcl () {
  return useContext(FclContext);
}
