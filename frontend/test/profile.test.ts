import path from "path";
import { beforeEach, jest, describe, test, expect } from "@jest/globals";
import {
  init,
  emulator,
  sendTransaction,
  deployContractByName,
  getAccountAddress,
  executeScript
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
    const Bob = await getAccountAddress("Alice");

    console.log({ Alice });

    let isRegistered = await executeScript({
      name: 'is-registered',
      args: [Alice]
    })
    expect(isRegistered[0]).toBeNull()
    console.log({ isRegistered })

    const [deploymentResult, error] = await deployContractByName({
      to: Bob,
      name: "TeaProfile",
    });
    console.log(deploymentResult, error);

    expect(deploymentResult.statusString).toEqual("SEALED");
    expect(error).toBeNull();

    const [tx, txError] = await sendTransaction({
      name: "register",
      args: ["Alice", "This is me!"],
      signers: [Alice],
    });
    console.log(tx.events);

    isRegistered = await executeScript({
      name: 'is-registered',
      args: [Alice]
    })
    expect(isRegistered[0]).toBeTruthy()
    console.log({ isRegistered })

    expect(txError).toBeNull();
    expect(tx.events.length).toBe(1);
    expect(tx.events[0].type).toContain("TeaProfile.Registration");
  });

  test("Duplicate profile on same account", async () => {
    const Alice = await getAccountAddress("Alice");
    await deployContractByName({
      to: Alice,
      name: "TeaProfile",
    });
    await sendTransaction({
      name: "register",
      args: ["Alice1", "This is me!"],
      signers: [Alice],
    });
    const [tx, error] = await sendTransaction({
      name: "register",
      args: ["Alice2", "This is me!"],
      signers: [Alice],
    });
    expect(error).toContain("Account is already registered");
  });
});
