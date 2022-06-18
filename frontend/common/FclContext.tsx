import React, { ReactChild, useContext, useEffect, useState } from "react";

// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as t from "@onflow/types";

// cadence files
// @ts-ignore
import getFlowBalanceCode from "../cadence/scripts/get-flow-balance.cdc";
// @ts-ignore
import getAddressCode from "../cadence/scripts/get-address.cdc";
// @ts-ignore
import getHandleCode from "../cadence/scripts/get-handle.cdc";
// @ts-ignore
import getInfoCode from "../cadence/scripts/get-info.cdc";
// @ts-ignore
import donateFlowCode from "../cadence/transactions/donate.cdc";
// @ts-ignore
import registerFlowCode from "../cadence/transactions/register.cdc";
// @ts-ignore
import updateFlowCode from "../cadence/transactions/update.cdc";
import { configureFcl } from "./fcl-config";
import {
  FlowTeaInfo,
  getAddress,
  getFlowBalance,
  getHandle,
  getInfo,
} from "./fcl-service";

type TxResult = { transactionId: string; status: any };

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
  getAddress: (handle: string) => Promise<null | string>;
  getHandle: (address: string) => Promise<null | string>;
  isHandleAvailable: (handle: string) => Promise<boolean>;
  fetchCurrentUserInfo: () => Promise<FlowTeaInfo | null>;
  getInfo: (address: string) => Promise<FlowTeaInfo | null>;
  donateFlow: (
    message: string,
    amount: number,
    recurring: boolean,
    receiverAddress: string
  ) => Promise<TxResult>;
  getFlowBalance: (address: string) => Promise<number>;
  register: (
    handle: string,
    name: string,
    websiteUrl: string,
    description: string
  ) => Promise<TxResult>;
  update: (
    name: string,
    websiteUrl: string,
    description: string
  ) => Promise<TxResult>;
};

const defaultTxResult = { transactionId: "", status: "" };

export type FlowUser = {
  addr: string;
  cid: string;
  expiresAt: null;
  f_type: "USER";
  f_vsn: string;
  loggedIn: true;
  services: any[];
};

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
  getHandle: () => Promise.resolve(null),
  isHandleAvailable: () => Promise.resolve(false),
  fetchCurrentUserInfo: () => Promise.resolve(null),
  getInfo: () => Promise.resolve(null),
  donateFlow: () => Promise.resolve(defaultTxResult),
  getFlowBalance: () => Promise.resolve(0),
  register: () => Promise.resolve(defaultTxResult),
  update: () => Promise.resolve(defaultTxResult),
};

const FclContext = React.createContext(defaultValue);

export function FclProvider({
  config = {},
  children,
}: {
  config?: object;
  children: ReactChild;
}) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [info, setInfo] = useState<FlowTeaInfo | null>(null);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isSendingDonation, setIsSendingDonation] = useState(false);

  useEffect(() => {
    configureFcl(config);
  }, [config]);

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  useEffect(() => {
    if (user?.addr) {
      fetchCurrentUserInfo();
    }
  }, [user]);

  async function isHandleAvailable(handle: string) {
    return getAddress(handle)
      .then(() => false)
      .catch((e) =>
        e.toString().match("Handle not found") ? true : Promise.reject(e)
      );
  }

  async function register(
    handle: string,
    name: string,
    websiteUrl: string,
    description: string
  ) {
    return sendTransaction(registerFlowCode, [
      fcl.arg(handle, t.String),
      fcl.arg(name, t.String),
      fcl.arg(websiteUrl, t.String),
      fcl.arg(description, t.String),
    ]);
  }

  async function update(name: string, websiteUrl: string, description: string) {
    return sendTransaction(updateFlowCode, [
      fcl.arg(name, t.String),
      fcl.arg(websiteUrl, t.String),
      fcl.arg(description, t.String),
    ]);
  }

  async function donateFlow(
    message: string,
    amount: number,
    recurring: boolean,
    receiverAddress: string
  ) {
    try {
      setIsSendingDonation(true);
      return await sendTransaction(donateFlowCode, [
        fcl.arg(message, t.String),
        fcl.arg(`${Math.round(amount)}.0`, t.UFix64),
        fcl.arg(recurring, t.Bool),
        fcl.arg(receiverAddress, t.Address),
      ]);
    } finally {
      setIsSendingDonation(false);
    }
  }

  async function sendTransaction(cadence: string, args: any[]) {
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

  async function logout() {
    setLoggingOut(true);
    try {
      await fcl.unauthenticate();
      setInfo(null);
    } finally {
      setLoggingOut(false);
    }
  }

  async function login() {
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
      console.error(e);
      return null;
    }
  }

  return (
    <FclContext.Provider
      value={{
        getFlowBalance,
        donateFlow,
        login,
        logout,
        update,
        register,
        getInfo,
        getAddress,
        getHandle,
        isHandleAvailable,
        fetchCurrentUserInfo,
        user,
        info,
        isSendingDonation,
        isRegistered: Boolean(info),
        isLoggedIn: user?.loggedIn,
        isLoggingIn,
        isLoggingOut,
      }}
    >
      {children}
    </FclContext.Provider>
  );
}

export function useFcl() {
  return useContext(FclContext);
}
