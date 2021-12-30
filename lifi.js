require('dotenv').config()

import sdk from "@lifinance/sdk";
import ethers from "ethers";

const NETWORKS = require('./configs').NETWORKS;
const Lifi = sdk.default;

const SETTINGS = {
  FROM: NETWORKS.POLYGON,
  TO: NETWORKS.XDAI,
  SLIPPAGE: 0.03,
  AMOUNT: "1000000" // 1 USDT
}

async function main() {
  // setup wallet
  if (!process.env.PRIVATE_KEY) {
    console.warn(
      'Please specify a PRIVATE_KEY phrase in your .env file: `PRIVATE_KEY="..."`'
    );
    return;
  }
  console.log(">> Setup Wallet");
  const provider = new ethers.providers.JsonRpcProvider(SETTINGS.FROM.RPC, SETTINGS.FROM.CHAINID);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);

  // get Route
  console.log(">> Request route");
  const routeRequest = {
    fromChainId: SETTINGS.FROM.CHAINID, // Polygon
    fromAmount: SETTINGS.AMOUNT, // 1 USDT
    fromTokenAddress: SETTINGS.FROM.TOKEN_ADDRESSES.USDT, // USDT
    toChainId: SETTINGS.TO.CHAINID, // xDai
    toTokenAddress: SETTINGS.TO.TOKEN_ADDRESSES.USDT, // USDT
    options: { slippage: SETTINGS.SLIPPAGE },
  };

  const routeResponse = await Lifi.getRoutes(routeRequest);
  const route = routeResponse.routes[0];
  console.log(">> Got Route");
  console.log(route);

  // execute Route
  console.log(">> Start Execution");
  const settings = {
    updateCallback: (updatedRoute) => {
      let lastExecution;
      for (const step of updatedRoute.steps) {
        if (step.execution) {
          lastExecution = step.execution;
        }
      }
      console.log(lastExecution);
    },
    switchChainHook: async (requiredChainId) => {
      console.log(">>Switching Chains");
      const provider = new ethers.providers.JsonRpcProvider(SETTINGS.TO.RPC, SETTINGS.TO.CHAINID);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);
      return wallet;
    },
  };
  await Lifi.executeRoute(wallet, route, settings);
  console.log("DONE");
}

main();