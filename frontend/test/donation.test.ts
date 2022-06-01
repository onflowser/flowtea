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

describe("TeaDonation", () => {
  // Instantiate emulator and path to Cadence files
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    const port = 8080;
    await init(basePath, { port });
    return emulator.start(port);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    // return emulator.stop();
  });

  test("Profile registration", async () => {
    const Alice = await getAccountAddress("Alice");
    const Bob = await getAccountAddress("Bob");
    console.log({ Alice, Bob });

    await mintFlow(Alice, "1.0");

    const [deploymentResult, error] = await deployContractByName({
      to: Alice,
      name: "TeaDonation",
    });

    expect(deploymentResult.statusString).toEqual("SEALED");
    expect(error).toBeNull();

    const [tx, txError] = await sendTransaction({
      name: "donate",
      args: ["Thanks for your hard work!", 0.5, true, Bob],
      signers: [Alice],
    });
    console.log(tx, txError);

    const donationEvents = tx.events.filter((event: { type: string }) =>
      event.type.includes("TeaDonation.Donation")
    );

    console.log(donationEvents[0]);
    expect(txError).toBeNull();
    expect(donationEvents.length).toBe(1);
  });
});
