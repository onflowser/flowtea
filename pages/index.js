import { useFlow } from "../flow/fcl";
import * as t from "@onflow/types"
import * as fcl from "@onflow/fcl"
import sendFlowTxCode from "../flow/transactions/send-flow.cdc";

export default function Home () {
  const {isLoggedIn, user, login, logout, sendTransaction} = useFlow({
    "app.detail.title": "Support on Flow",
  })

  function sendFlowTx() {
    sendTransaction(sendFlowTxCode, [
      fcl.arg(`1.0`, t.UFix64),
      fcl.arg('0xf8d6e0586b0a20c7', t.Address),
    ]).then(console.log)
  }

  return (
    <div>
      {isLoggedIn ? `Address: ${user.addr}` : 'Please sign in'}
      <main>
        {isLoggedIn ? (
          <>
            <button onClick={logout}>Logout</button>
            <button onClick={sendFlowTx}>Send</button>
          </>
        ) : <button onClick={login}>Login</button>}
        {isLoggedIn && <pre>{JSON.stringify(user, null, 4)}</pre>}
      </main>
    </div>
  )
}
