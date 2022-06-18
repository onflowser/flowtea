import path from "path";
import { beforeEach, jest, describe, test, expect } from "@jest/globals";
import {
  init,
  emulator,
  sendTransaction,
  deployContractByName,
  getAccountAddress,
  executeScript,
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

    const [deploymentResult, error] = await deployContractByName({
      to: Bob,
      name: "TeaProfile",
    });
    expect(deploymentResult.statusString).toEqual("SEALED");
    expect(error).toBeNull();

    // Alice registers to FlowTea
    const [tx1, txError1] = await sendTransaction({
      name: "register",
      args: ["alice", "Alice", "My description"],
      signers: [Alice],
    });
    expect(txError1).toBeNull();
    expect(tx1.events.length).toBe(1);
    expect(tx1.events[0].type).toContain("TeaProfile.Registration");

    const [info] = await executeScript({
      name: "get-info",
      args: [Alice],
    });
    expect(info).toEqual({ name: "Alice", description: "My description" });

    // Alice updates her own account's settings
    const [tx2, txError2] = await sendTransaction({
      name: "update",
      args: ["Alice", "My new description"],
      signers: [Alice],
    });
    expect(txError2).toBeNull();

    const [updatedInfo] = await executeScript({
      name: "get-info",
      args: [Bob],
    });
    expect(updatedInfo).toEqual({
      name: "Alice",
      description: "My new description",
    });
  });

  test("Duplicate profile on same account", async () => {
    const Alice = await getAccountAddress("Alice");
    await deployContractByName({
      to: Alice,
      name: "TeaProfile",
    });
    await sendTransaction({
      name: "register",
      args: ["alice1", "Alice1", "This is me!"],
      signers: [Alice],
    });
    const [tx, error] = await sendTransaction({
      name: "register",
      args: ["alice2", "Alice2", "This is me!"],
      signers: [Alice],
    });
    expect(error).toContain("Account is already registered");
  });

  test("Duplicate profile handle", async () => {
    const Owner = await getAccountAddress("Owner");
    const Alice = await getAccountAddress("Alice");
    const Bob = await getAccountAddress("Bob");

    await deployContractByName({
      to: Owner,
      name: "TeaProfile",
    });

    // Alice registers and reserves usage of her project handle
    const [tx1, err1] = await sendTransaction({
      name: "register",
      args: ["alice", "Alice", "This is Alice!"],
      signers: [Alice],
    });
    expect(err1).toBeNull();

    // Bob tries to register under the same handle
    const [tx2, err2] = await sendTransaction({
      name: "register",
      args: ["alice", "Bob", "This is Bob, but with Alice's handle!"],
      signers: [Bob],
    });

    expect(err2).toContain("Handle is already taken");
  });
});
