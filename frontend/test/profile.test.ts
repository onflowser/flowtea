import path from "path";
import { beforeEach, jest, describe, test, expect } from "@jest/globals";
import {
  init,
  emulator,
  sendTransaction,
  deployContractByName,
  getAccountAddress,
// @ts-ignore
} from "flow-js-testing";
import { afterEach } from "@jest/globals";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(10000);

describe("TeaProfile", () => {
  // Instantiate emulator and path to Cadence files
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../cadence");
    const port = 8080;
    await init(basePath, { port });
    return emulator.start(port);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop();
  });

  test("Profile registration", async () => {
    const Alice = await getAccountAddress("Alice");

    const [deploymentResult, error] = await deployContractByName({
      to: Alice,
      name: "TeaProfile"
    });
    console.log(deploymentResult, error);

    expect(deploymentResult.statusString).toEqual("SEALED");
    expect(error).toBeNull();

    const [tx, txError] = await sendTransaction({
      name: "register",
      args: ["Alice", "2022"],
      signers: [Alice]
    });
    console.log(tx, txError);

    expect(txError).toBeNull();
    expect(tx.events.length).toBe(1);
    expect(tx.events[0].type).toContain("TeaProfile.Registration");
  });

  test("Duplicate profile on same account", async () => {
    const Alice = await getAccountAddress("Alice");
    await deployContractByName({
      to: Alice,
      name: "TeaProfile"
    });
    await sendTransaction({
      name: "register",
      args: ["Alice1", "2022"],
      signers: [Alice]
    });
    const [tx, error] = await sendTransaction({
      name: "register",
      args: ["Alice2", "2022"],
      signers: [Alice]
    });
    expect(error).toContain("Account is already registered");
  });
});
