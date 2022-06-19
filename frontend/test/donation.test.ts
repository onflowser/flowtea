import path from "path";
import { beforeEach, jest, describe, test, expect } from "@jest/globals";
import {
  init,
  emulator,
  sendTransaction,
  deployContractByName,
  getAccountAddress,
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

    await mintFlow(Alice, "2.0");

    const [deploymentResult, error1] = await deployContractByName({
      to: Owner,
      name: "FlowTea",
      args: [Owner],
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
      args: ["Good work bob!", 1, true, Bob],
      signers: [Alice],
    });
    expect(error3).toBeNull();
    console.log(donateTx);
  });
});
