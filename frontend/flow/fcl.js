import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import transferFlowCode from "./transactions/transfer-flow.cdc";
import getFlowBalanceCode from "./scripts/get-flow-balance.cdc";
import * as t from "@onflow/types";

export function useFlow(config) {
  const [user, setUser] = useState({ loggedIn: null });
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fcl.config({
      "env": "local",
      "accessNode.api": "http://localhost:8080", // FIXME: works with :8080, but should work with :8888
      "discovery.wallet": "http://localhost:8701/fcl/authn",
      "0xFLOWTOKENADDRESS": "0x0ae53cb6e3f42a79",
      "0xFUNGIBLETOKENADDRESS": "0xee82856bf20e2aa6",
      ...config
    })
  }, [config])
  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  async function getFlowBalance(address) {
    return fcl.send([
      fcl.script(getFlowBalanceCode),
      fcl.args([
        fcl.arg(address, t.Address),
      ])
    ]).then(fcl.decode)
  }

  function transferFlow(amount, receiverAddress) {
    return sendTransaction(transferFlowCode, [
      fcl.arg(amount, t.UFix64),
      fcl.arg(receiverAddress, t.Address),
    ])
  }

  async function sendTransaction(cadence, args) {
    const transactionId = await fcl.mutate({
      cadence,
      args: (arg, t) => args,
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

  async function logout() {
    setLoggingOut(true);
    try {
      return fcl.unauthenticate();
    }  finally {
      setLoggingOut(false);
    }
  }

  async function login() {
    setLoggingIn(true);
    try {
      return fcl.authenticate();
    } finally {
      setLoggingIn(false);
    }
  }

  return {
    login,
    logout,
    user,
    isLoggingIn,
    isLoggingOut,
    isLoggedIn: user.loggedIn,
    tx: {
      transferFlow,
      getFlowBalance
    }
  };
}
