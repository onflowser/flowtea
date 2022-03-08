import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import { toast } from 'react-hot-toast';

export function useFlow(config) {
  const [user, setUser] = useState({ loggedIn: null });
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fcl.config({
      "env": "local",
      "accessNode.api": "http://localhost:8888", // FIXME: works with :8080
      "discovery.wallet": "http://localhost:8701/fcl/authn",
      "0xTOKENADDRESS": "0xf8d6e0586b0a20c7",
      "0xFUNGIBLETOKENADDRESS": "0xf8d6e0586b0a20c7",
      ...config
    })
  }, [config])
  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  async function sendTransaction(cadence, args) {
    const transactionId = await fcl.mutate({
      cadence,
      args,
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
      await fcl.unauthenticate();
      toast('Logged out!');
    } catch (e) {
      console.log(e);
      toast.error(`Logout failed: ${e.message}`);
    } finally {
      setLoggingOut(false);
    }
  }

  async function login() {
    setLoggingIn(true);
    try {
      const result = await fcl.authenticate();
      if (result.loggedIn) {
        toast('Logged in!');
      }
    } catch (e) {
      toast.error(`Login failed: ${e.message}`);
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
    sendTransaction,
  };
}
