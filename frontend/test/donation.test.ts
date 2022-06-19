import path from "path";
import { beforeEach, jest, describe, test, expect } from "@jest/globals";
import {
  init,
  emulator,
  sendTransaction,
  deployContractByName,
  getAccountAddress,
  executeScript,
  mintFlow,
  // @ts-ignore
} from "flow-js-testing";
import { afterEach } from "@jest/globals";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(10000);

describe("FlowTea donation", () => {
  // Instantiate emulator and path to Cadence files
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    const port = 8080;
    await init(basePath, { port });
    return emulator.start(port);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    await emulator.stop();
  });

  test("Donate", async () => {
    const Alice = await getAccountAddress("Alice");
    const Bob = await getAccountAddress("Bob");
    const Owner = await getAccountAddress("Owner");
    const fee = 0.05; // set 5% fee
    // every new account has a default balance of 0.001
    const defaultAccBalance = 0.001;
    const donatedAmount = 1;

    await mintFlow(Alice, "2.0");

    const [deploymentResult, error1] = await deployContractByName({
      to: Owner,
      name: "FlowTea",
      args: [Owner, `${fee}`],
    });
    expect(error1).toBeNull();
    console.log(deploymentResult);

    const [registerTx, error2] = await sendTransaction({
      name: "register",
      args: ["bob", "Bob", "https://example.com", "This is Bob!"],
      signers: [Bob],
    });
    expect(error2).toBeNull();
    console.log(registerTx);

    const [donateTx, error3] = await sendTransaction({
      name: "donate",
      args: ["Good work bob!", donatedAmount, true, Bob],
      signers: [Alice],
    });
    expect(error3).toBeNull();

    // Make sure donation event is fired
    const donationEvent = donateTx.events.find((event: any) =>
      event.type.match("FlowTea.Donation")
    );
    expect(donationEvent !== null).toBeTruthy();
    console.log(donateTx);

    const bobBalance = await getFlowBalance(Bob);
    const ownerBalance = await getFlowBalance(Owner);

    expect(bobBalance).toBeCloseTo(donatedAmount + defaultAccBalance);
    expect(ownerBalance).toBeCloseTo(donatedAmount * fee + defaultAccBalance);
  });
});

async function getFlowBalance(address: string) {
  const [result, error] = await executeScript({
    name: "get-flow-balance",
    args: [address],
  });
  if (error) {
    throw error;
  }
  return +result;
}
