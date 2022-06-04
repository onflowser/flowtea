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

    console.log({ Alice, Bob });

    let isRegistered = await executeScript({
      name: 'is-registered',
      args: [Alice]
    })
    expect(isRegistered[0]).toBeNull()

    const [deploymentResult, error] = await deployContractByName({
      to: Bob,
      name: "TeaProfile",
    });
    console.log(deploymentResult, error);

    expect(deploymentResult.statusString).toEqual("SEALED");
    expect(error).toBeNull();

    // Alice registers to FlowTea
    const [tx1, txError1] = await sendTransaction({
      name: "register",
      args: ["Alice", "My description"],
      signers: [Alice],
    });
    expect(txError1).toBeNull();
    expect(tx1.events.length).toBe(1);
    expect(tx1.events[0].type).toContain("TeaProfile.Registration");

    // check if Alice is registered
    isRegistered = await executeScript({
      name: 'is-registered',
      args: [Alice]
    })
    expect(isRegistered[0]).toBeTruthy()


    const [info] = await executeScript({
      name: 'get-info',
      args: [Alice]
    })
    expect(info).toEqual({ name: "Alice", description: "My description" })

    // Alice updates her own account's settings
    const [tx2, txError2] = await sendTransaction({
      name: "update",
      args: ["Alice", "My new description"],
      signers: [Alice],
    });
    console.log(tx2, txError2)

    const [updatedInfo] = await executeScript({
      name: 'get-info',
      args: [Bob]
    })
    expect(updatedInfo).toEqual({ name: "Alice", description: "My new description" })
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
