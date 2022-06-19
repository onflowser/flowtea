import path from "path";
import { beforeEach, jest, describe, test, expect } from "@jest/globals";
import {
  init,
  emulator,
  sendTransaction,
  deployContractByName,
  deployContract,
  getAccountAddress,
  executeScript,
  // @ts-ignore
} from "flow-js-testing";
import { afterEach } from "@jest/globals";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(10000);

describe("FlowTea profile", () => {
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
    const Bob = await getAccountAddress("Bob");

    const [deploymentResult, error] = await deployContractByName({
      to: Bob,
      name: "TeaProfile",
      args: [Bob],
    });
    expect(deploymentResult.statusString).toEqual("SEALED");
    expect(error).toBeNull();

    // Alice registers to FlowTea
    const [tx1, txError1] = await sendTransaction({
      name: "register",
      args: ["alice", "Alice", "https://example.com", "My description"],
      signers: [Alice],
    });
    expect(txError1).toBeNull();
    expect(tx1.events.length).toBe(1);
    expect(tx1.events[0].type).toContain("TeaProfile.Registration");

    const [info] = await executeScript({
      name: "get-info",
      args: [Alice],
    });
    expect(info).toEqual({
      name: "Alice",
      websiteUrl: "https://example.com",
      description: "My description",
    });

    // Alice updates her own account's settings
    const [tx2, txError2] = await sendTransaction({
      name: "update",
      args: ["Alice", "https://example.com", "My new description"],
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
      websiteUrl: "https://example.com",
    });
  });

  test("Duplicate profile on same account", async () => {
    const Alice = await getAccountAddress("Alice");
    await deployContractByName({
      to: Alice,
      name: "TeaProfile",
      args: [Alice],
    });
    await sendTransaction({
      name: "register",
      args: ["alice1", "Alice1", "https://example.com", "This is me!"],
      signers: [Alice],
    });
    const [tx, error] = await sendTransaction({
      name: "register",
      args: ["alice2", "Alice2", "https://example.com", "This is me!"],
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
      args: [Owner],
    });

    // Alice registers and reserves usage of her project handle
    const [tx1, err1] = await sendTransaction({
      name: "register",
      args: ["alice", "Alice", "https://example.com", "This is Alice!"],
      signers: [Alice],
    });
    expect(err1).toBeNull();

    // Bob tries to register under the same handle
    const [tx2, err2] = await sendTransaction({
      name: "register",
      args: [
        "alice",
        "Bob",
        "https://example.com",
        "This is Bob, but with Alice's handle!",
      ],
      signers: [Bob],
    });

    expect(err2).toContain("Handle is already taken");
  });
});
