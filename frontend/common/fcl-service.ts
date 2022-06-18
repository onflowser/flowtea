// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as t from "@onflow/types";

// @ts-ignore
import getFlowBalanceCode from "../cadence/scripts/get-flow-balance.cdc";
// @ts-ignore
import getInfoCode from "../cadence/scripts/get-info.cdc";
// @ts-ignore
import getAddressCode from "../cadence/scripts/get-address.cdc";
// @ts-ignore
import getHandleCode from "../cadence/scripts/get-handle.cdc";

export type FlowTeaInfo = {
  name: string;
  websiteUrl: string;
  description: string;
};

export function isUserIdAddress(userId: string | undefined) {
  return userId?.startsWith("0x");
}

export async function sendTransaction(cadence: string, args: any[]) {
  const transactionId = await fcl.mutate({
    cadence,
    args: () => args,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 100,
  });

  return {
    transactionId,
    status: await fcl.tx(transactionId).onceSealed(),
  };
}

export async function getFlowBalance(address: string) {
  return fcl
    .send([
      fcl.script(getFlowBalanceCode),
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode);
}

export async function getInfo(address: string) {
  return fcl
    .send([fcl.script(getInfoCode), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode) as Promise<FlowTeaInfo | null>;
}

export async function getAddress(handle: string) {
  return fcl
    .send([fcl.script(getAddressCode), fcl.args([fcl.arg(handle, t.String)])])
    .then(fcl.decode) as Promise<string | null>;
}

export async function getHandle(address: string) {
  return fcl
    .send([fcl.script(getHandleCode), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode) as Promise<string | null>;
}
