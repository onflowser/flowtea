// @ts-ignore
import * as fcl from "@onflow/fcl";
import { env, Environment, getDomain } from "./utils";
import { config } from "./config";

export function configureFcl(overrideConfig = {}) {
  fcl.config({
    "app.detail.title": "FlowTea",
    env: getFlowEnv(env),
    "app.detail.icon": getIconUrl(),
    "accessNode.api": getAccessNodeApi(env),
    "discovery.wallet": getDiscoveryWallet(env),
    "0xFungibleToken": getFungibleTokenAddress(env),
    "0xFlowTea": config.flow.deploymentAccountAddress,
    ...overrideConfig,
  });
}

function getAccessNodeApi(env: Environment) {
  switch (env) {
    case "production":
      return "https://rest-mainnet.onflow.org/v1";
    case "staging":
      return "https://rest-testnet.onflow.org/v1";
    case "development":
      return "http://localhost:8080";
  }
}

function getDiscoveryWallet(env: Environment) {
  switch (env) {
    case "production":
    case "staging":
      return "https://fcl-discovery.onflow.org/testnet/authn";
    case "development":
      return "http://localhost:8701/fcl/authn";
  }
}

function getFungibleTokenAddress(env: Environment) {
  // https://docs.onflow.org/core-contracts/fungible-token/
  switch (env) {
    case "production":
      return "0xf233dcee88fe0abe";
    case "staging":
      return "0x9a0766d93b6608b7";
    case "development":
      return "0xee82856bf20e2aa6";
  }
}

function getFlowEnv(env: Environment) {
  switch (env) {
    case "production":
      return "mainnet";
    case "staging":
      return "testnet";
    case "development":
      return "local";
  }
}

function getIconUrl() {
  const path = "/images/logo-BMFT-no-text.svg";
  return getDomain() + path;
}
