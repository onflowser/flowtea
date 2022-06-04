import React, {
  ReactChild,
  useContext,
  useEffect,
  useState
} from "react";
// @ts-ignore
import * as fcl from '@onflow/fcl';
// @ts-ignore
import * as t from "@onflow/types";

// cadence files
// @ts-ignore
import getFlowBalanceCode from "../cadence/scripts/get-flow-balance.cdc";
// @ts-ignore
import donateFlowCode from "../cadence/transactions/donate.cdc";
// @ts-ignore
import registerFlowCode from "../cadence/transactions/register.cdc";

type TxResult = { transactionId: string, status: any };

type FclContextProps = {
  user: null | any;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  donateFlow: (amount: number, receiverAddress: string) => Promise<TxResult>;
  getFlowBalance: (address: string) => Promise<number>
  register: (name: string) => Promise<TxResult>
}

const defaultTxResult = { transactionId: '', status: '' };

const defaultValue: FclContextProps = {
  user: null,
  isLoggingIn: false,
  isLoggingOut: false,
  isLoggedIn: false,
  login: () => null,
  logout: () => null,
  donateFlow: () => Promise.resolve(defaultTxResult),
  getFlowBalance: () => Promise.resolve(0),
  register: () => Promise.resolve(defaultTxResult)
}

const FclContext = React.createContext(defaultValue);

export function FclProvider ({ config = {}, children } : {config?: object, children: ReactChild}) {
  const [user, setUser] = useState({ loggedIn: null });
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);

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

  async function getFlowBalance (address: string) {
    return fcl.send([
      fcl.script(getFlowBalanceCode),
      fcl.args([
        fcl.arg(address, t.Address),
      ])
    ]).then(fcl.decode)
  }

  async function register (name: string) {
    return sendTransaction(registerFlowCode, [
      fcl.arg(name, t.String),
      fcl.arg(new Date().toISOString(), t.String)
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
      register,
      user,
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
