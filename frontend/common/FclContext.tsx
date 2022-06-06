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
  isLoggedIn: boolean|undefined;
  isSendingDonation: boolean;
  isRegistered: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUserInfo: () => Promise<FlowTeaInfo|null>;
  getInfo: (address: string) => Promise<FlowTeaInfo|null>;
  donateFlow: (message: string, amount: number, recurring: boolean, receiverAddress: string) => Promise<TxResult>;
  getFlowBalance: (address: string) => Promise<number>
  register: (name: string, description: string) => Promise<TxResult>
  update: (name: string, description: string) => Promise<TxResult>
}

const defaultTxResult = { transactionId: '', status: '' };

export type FlowUser = {
  addr: string
  cid: string
  expiresAt: null
  f_type: "USER"
  f_vsn: string
  loggedIn: true
  services: any[]
}

export type FlowTeaInfo = {
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
  isSendingDonation: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  fetchCurrentUserInfo: () => Promise.resolve(null),
  getInfo: () => Promise.resolve(null),
  donateFlow: () => Promise.resolve(defaultTxResult),
  getFlowBalance: () => Promise.resolve(0),
  register: () => Promise.resolve(defaultTxResult),
  update: () => Promise.resolve(defaultTxResult)
}

type Environment = 'development' | 'staging' | 'production';

const env: Environment = process.env.NODE_ENV as Environment;

function getAccessNodeApi(env: Environment) {
  switch (env) {
    case "production":
      return "https://rest-mainnet.onflow.org/v1"
    case "staging":
      return "https://rest-testnet.onflow.org/v1"
    case "development":
      return "http://localhost:8080"
  }
}

function getDiscoveryWallet(env: Environment) {
  switch (env) {
    case "production":
    case "staging":
      return "https://fcl-discovery.onflow.org/testnet/authn"
    case "development":
      return "http://localhost:8701/fcl/authn"
  }
}

function getFungibleTokenAddress(env: Environment) {
  // https://docs.onflow.org/core-contracts/fungible-token/
  switch (env) {
    case "production":
      return "0xf233dcee88fe0abe"
    case "staging":
      return "0x9a0766d93b6608b7"
    case "development":
      return "0xee82856bf20e2aa6"
  }
}

function getFlowTeaAddress(env: Environment) {
  switch (env) {
    case "production":
    case "staging":
    case "development":
      return "0xee82856bf20e2aa6"
  }
}

function getFlowEnv(env: Environment) {
  switch (env) {
    case "production":
      return "mainnet"
    case "staging":
      return "testnet"
    case "development":
      return "local"
  }
}

function getIconUrl(env: Environment) {
  const path = "/images/logo-BMFT-no-text.svg";
  const domain = window.location.host;
  switch (env) {
    case "production":
    case "staging":
      return `https://${domain}${path}`
    case "development":
      return `http://${domain}${path}`
  }
}

const FclContext = React.createContext(defaultValue);

export function FclProvider ({ config = {}, children } : {config?: object, children: ReactChild}) {
  const [user, setUser] = useState<FlowUser|null>(null);
  const [info, setInfo] = useState<FlowTeaInfo|null>(null);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isSendingDonation, setIsSendingDonation] = useState(false);

  useEffect(() => {
    fcl.config({
      "app.detail.title": "FlowTea",
      "env": getFlowEnv(env),
      "app.detail.icon": getIconUrl(env),
      "accessNode.api": getAccessNodeApi(env),
      "discovery.wallet": getDiscoveryWallet(env),
      "0xFUNGIBLETOKENADDRESS": getFungibleTokenAddress(env),
      "0xTEADONATIONADDRESS": getFlowTeaAddress(env),
      "0xTEAPROFILEADDRESS": getFlowTeaAddress(env),
      ...config
    })
  }, [config])

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  useEffect(() => {
    if (user?.addr) {
      fetchCurrentUserInfo();
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

  async function getInfo (address: string) {
    return fcl.send([
      fcl.script(getInfoCode),
      fcl.args([
        fcl.arg(address, t.Address),
      ])
    ])
      .then(fcl.decode) as Promise<FlowTeaInfo|null>
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

  async function donateFlow (message: string, amount: number, recurring: boolean, receiverAddress: string) {
    try {
      setIsSendingDonation(true);
      return await sendTransaction(donateFlowCode, [
        fcl.arg(message, t.String),
        fcl.arg(`${Math.round(amount)}.0`, t.UFix64),
        fcl.arg(recurring, t.Bool),
        fcl.arg(receiverAddress, t.Address),
      ])
    } finally {
      setIsSendingDonation(false);
    }
  }

  async function sendTransaction (cadence: string, args: any[]) {
    const transactionId = await fcl.mutate({
      cadence,
      args: () => args,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100,
    });

    return {
      transactionId,
      status: await fcl.tx(transactionId).onceSealed(),
    };
  }

  async function logout () {
    setLoggingOut(true);
    try {
      await fcl.unauthenticate();
      setInfo(null);
    } finally {
      setLoggingOut(false);
    }
  }

  async function login () {
    setLoggingIn(true);
    try {
      return await fcl.authenticate();
    } finally {
      setLoggingIn(false);
    }
  }

  async function fetchCurrentUserInfo() {
    if (!user) return null;
    try {
      const info = await getInfo(user.addr);
      setInfo(info);
      return info;
    } catch (e) {
      console.error(e)
      return null;
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
      getInfo,
      fetchCurrentUserInfo,
      user,
      info,
      isSendingDonation,
      isRegistered: Boolean(info),
      isLoggedIn: user?.loggedIn,
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
