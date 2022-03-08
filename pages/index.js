import { useFlow } from "../flow/fcl";
import { useEffect, useState } from "react";

export default function Home () {
  const [flowBalance, setFlowBalance] = useState(0);
  const { isLoggedIn, user, login, logout, tx } = useFlow({
    "app.detail.title": "Coffee on Flow",
    "app.detail.icon": "https://flowser.dev/images/logo.svg",
  })

  async function transferFlow () {
    await tx.transferFlow('1.0', '0x0ae53cb6e3f42a79');
    await fetchFlowBalance();
  }

  async function fetchFlowBalance () {
    const amount = await tx.getFlowBalance('0xf8d6e0586b0a20c7');
    setFlowBalance(parseFloat(amount));
  }

  useEffect(() => {
    fetchFlowBalance();
  }, [])

  return (
    <div>
      {isLoggedIn ? (
        <>
          <ul>
            <li>Address: {user.addr}</li>
            <li>Balance: {flowBalance}</li>
          </ul>
          <button onClick={logout}>Logout</button>
          <button onClick={transferFlow}>Send</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  )
}
