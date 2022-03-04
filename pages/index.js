import * as fcl from "@onflow/fcl";
import { useState } from "react";


fcl.config({
  // "env": "local",
  "env": "testnet",
  "accessNode.api": "http://localhost:8080",
  // "accessNode.api": "https://access-testnet.onflow.org",
  "discovery.wallet": "http://localhost:8701/fcl/authn", // Endpoint set to Testnet
  // "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
  "app.detail.title": "Support #onflow",
})

export default function Home () {
  const [auth, setAuth] = useState();

  function login () {
    fcl.authenticate().then(setAuth)
  }

  function logout () {
    fcl.currentUser().unauthenticate();
  }

  async function sendTx () {
    const response = await fcl.send([
      fcl.transaction`
    transaction {
      prepare(acct: AuthAccount) {
        log("Hello from prepare")
      }
      execute {
        log("Hello from execute")
      }
    }
  `,
      fcl.proposer(fcl.currentUser().authorization),
      fcl.authorizations([
        fcl.currentUser().authorization,
      ]),
      fcl.payer(fcl.currentUser().authorization),
    ])

    const transaction = await fcl.tx(response).onceSealed()
    console.log(transaction)
  }

  return (
    <div>
      {auth ? `Address: ${auth.addr}` : 'Please sign in'}
      <main>
        {auth ? (
          <>
            <button onClick={logout}>Logout</button>
            <button onClick={sendTx}>Send</button>
          </>
        ) : <button onClick={login}>Login</button>}
        {auth && <pre>{JSON.stringify(auth, null, 4)}</pre>}
      </main>
    </div>
  )
}
