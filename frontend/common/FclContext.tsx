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
import getAddressCode from "../cadence/scripts/get-address.cdc";
// @ts-ignore
import getSlugCode from "../cadence/scripts/get-slug.cdc";
// @ts-ignore
import getInfoCode from "../cadence/scripts/get-info.cdc";
// @ts-ignore
import donateFlowCode from "../cadence/transactions/donate.cdc";
// @ts-ignore
import registerFlowCode from "../cadence/transactions/register.cdc";
// @ts-ignore
import updateFlowCode from "../cadence/transactions/update.cdc";
import { env, Environment, getDomain } from "./utils";

type TxResult = { transactionId: string, status: any };

type FclContextProps = {
  user: null | FlowUser;
  info: null | FlowTeaInfo;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isLoggedIn: boolean | undefined;
  isSendingDonation: boolean;
  isRegistered: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAddress: (slug: string) => Promise<null | string>,
  getSlug: (address: string) => Promise<null | string>,
  isSlugAvailable: (slug: string) => Promise<boolean>,
  fetchCurrentUserInfo: () => Promise<FlowTeaInfo | null>;
  getInfo: (address: string) => Promise<FlowTeaInfo | null>;
  donateFlow: (message: string, amount: number, recurring: boolean, receiverAddress: string) => Promise<TxResult>;
  getFlowBalance: (address: string) => Promise<number>
  register: (slug: string, name: string, description: string) => Promise<TxResult>
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
  getAddress: () => Promise.resolve(null),
  getSlug: () => Promise.resolve(null),
  isSlugAvailable: () => Promise.resolve(false),
  fetchCurrentUserInfo: () => Promise.resolve(null),
  getInfo: () => Promise.resolve(null),
  donateFlow: () => Promise.resolve(defaultTxResult),
  getFlowBalance: () => Promise.resolve(0),
  register: () => Promise.resolve(defaultTxResult),
  update: () => Promise.resolve(defaultTxResult)
}



function getAccessNodeApi (env: Environment) {
  switch (env) {
    case "production":
      return "https://rest-mainnet.onflow.org/v1"
    case "staging":
      return "https://rest-testnet.onflow.org/v1"
    case "development":
      return "http://localhost:8080"
  }
}

function getDiscoveryWallet (env: Environment) {
  switch (env) {
    case "production":
    case "staging":
      return "https://fcl-discovery.onflow.org/testnet/authn"
    case "development":
      return "http://localhost:8701/fcl/authn"
  }
}

function getFungibleTokenAddress (env: Environment) {
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

function getFlowTokenAddress (env: Environment) {
  // https://docs.onflow.org/core-contracts/flow-token/
  switch (env) {
    case "production":
      return "0x1654653399040a61"
    case "staging":
      return "0x7e60df042a9c0868"
    case "development":
      return "0x0ae53cb6e3f42a79"
  }
}

function getFlowTeaAddress (env: Environment) {
  switch (env) {
    case "production":
    case "staging":
    case "development":
      return "0xf8d6e0586b0a20c7"
  }
}

function getFlowEnv (env: Environment) {
  switch (env) {
    case "production":
      return "mainnet"
    case "staging":
      return "testnet"
    case "development":
      return "local"
  }
}

function getIconUrl () {
  const path = "/images/logo-BMFT-no-text.svg";
  return getDomain() + path;
}

const FclContext = React.createContext(defaultValue);

export function FclProvider ({
  config = {},
  children
}: { config?: object, children: ReactChild }) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [info, setInfo] = useState<FlowTeaInfo | null>(null);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isSendingDonation, setIsSendingDonation] = useState(false);

  useEffect(() => {
    fcl.config({
      "app.detail.title": "FlowTea",
      "env": getFlowEnv(env),
      "app.detail.icon": getIconUrl(),
      "accessNode.api": getAccessNodeApi(env),
      "discovery.wallet": getDiscoveryWallet(env),
      "0xFungibleToken": getFungibleTokenAddress(env),
      "0xFlowToken": getFlowTokenAddress(env),
      "0xTeaDonation": getFlowTeaAddress(env),
      "0xTeaProfile": getFlowTeaAddress(env),
      ...config
    })
  }, [config])

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  useEffect(() => {
    if (user?.addr) {
      fetchCurrentUserInfo();
    }
  }, [user])

  async function getAddress (slug: string) {
    return fcl.send([
      fcl.script(getAddressCode),
      fcl.args([
        fcl.arg(slug, t.String),
      ])
    ]).then(fcl.decode) as Promise<string | null>
  }

  async function getSlug (address: string) {
    return fcl.send([
      fcl.script(getSlugCode),
      fcl.args([
        fcl.arg(address, t.Address),
      ])
    ]).then(fcl.decode) as Promise<string | null>
  }

  async function isSlugAvailable (slug: string) {
    return getAddress(slug)
      .then(() => false)
      .catch(e => e.toString().match("Slug not found") ? true : Promise.reject(e))
  }

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
      .then(fcl.decode) as Promise<FlowTeaInfo | null>
  }

  async function register (slug: string, name: string, description: string) {
    return sendTransaction(registerFlowCode, [
      fcl.arg(slug, t.String),
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

  async function fetchCurrentUserInfo () {
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
      getAddress,
      getSlug,
      isSlugAvailable,
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
