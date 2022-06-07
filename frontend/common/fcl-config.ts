// @ts-ignore
import * as fcl from '@onflow/fcl';
import { env, Environment, getDomain } from "./utils";

export function configureFcl(config = {}) {
  fcl.config({
    "app.detail.title": "FlowTea",
    "env": getFlowEnv(env),
    "app.detail.icon": getIconUrl(),
    "accessNode.api": getAccessNodeApi(env),
    "discovery.wallet": getDiscoveryWallet(env),
    "0xFungibleToken": getFungibleTokenAddress(env),
    "0xFlowToken": getFlowTokenAddress(env),
    "0xTeaDonation": getFlowTeaAddress(env),
    "0xTeaProfile": getFlowTeaAddress(env),
    ...config
  })
}

function getAccessNodeApi (env: Environment) {
  switch (env) {
    case "production":
      return "https://rest-mainnet.onflow.org/v1"
    case "staging":
      return "https://rest-testnet.onflow.org/v1"
    case "development":
      return "http://localhost:8080"
  }
}

function getDiscoveryWallet (env: Environment) {
  switch (env) {
    case "production":
    case "staging":
      return "https://fcl-discovery.onflow.org/testnet/authn"
    case "development":
      return "http://localhost:8701/fcl/authn"
  }
}

function getFungibleTokenAddress (env: Environment) {
  // https://docs.onflow.org/core-contracts/fungible-token/
  switch (env) {
    case "production":
      return "0xf233dcee88fe0abe"
    case "staging":
      return "0x9a0766d93b6608b7"
    case "development":
      return "0xee82856bf20e2aa6"
  }
}

function getFlowTokenAddress (env: Environment) {
  // https://docs.onflow.org/core-contracts/flow-token/
  switch (env) {
    case "production":
      return "0x1654653399040a61"
    case "staging":
      return "0x7e60df042a9c0868"
    case "development":
      return "0x0ae53cb6e3f42a79"
  }
}

function getFlowTeaAddress (env: Environment) {
  switch (env) {
    case "production":
    case "staging":
    case "development":
      return "0xf8d6e0586b0a20c7"
  }
}

function getFlowEnv (env: Environment) {
  switch (env) {
    case "production":
      return "mainnet"
    case "staging":
      return "testnet"
    case "development":
      return "local"
  }
}

function getIconUrl () {
  const path = "/images/logo-BMFT-no-text.svg";
  return getDomain() + path;
}
