import path from "path";
import { beforeEach, jest, describe, test } from "@jest/globals";
import {
  init,
  emulator,
  shallPass,
  sendTransaction,
  getAccountAddress,
// @ts-ignore
} from "flow-js-testing";
import { afterEach } from "@jest/globals";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(10000);

describe("interactions - sendTransaction", () => {
  // Instantiate emulator and path to Cadence files
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "./cadence");
    const port = 8080;
    await init(basePath, { port });
    return emulator.start(port);
  });

  // Stop emulator, so it could be restarted
  afterEach(async () => {
    return emulator.stop();
  });

  test("basic transaction", async () => {
    const code = `
      transaction(message: String){
        prepare(singer: AuthAccount){
          log(message)
        }
      }
    `;
    const Alice = await getAccountAddress("Alice");
    const signers = [Alice];
    const args = ["Hello, Cadence"];

    const [txResult, error] = await shallPass(
      sendTransaction({
        code,
        signers,
        args,
      }),
    );

    // Transaction result will hold status, events and error message
    console.log(txResult, error);
  });
});
