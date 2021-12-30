import dotenv from "dotenv";
import sdk from "@lifinance/sdk";
import ethers from "ethers";
import NETWORKS from "./configs.js";

dotenv.config();
const Lifi = sdk.default;

const SETTINGS = {
  FROM: NETWORKS.XDAI,
  TO: NETWORKS.POLYGON,
  SLIPPAGE: 0.03,
  AMOUNT: 1000000 / 4 // 0.25 USDT
}

async function main() {

  if (!process.env.PRIVATE_KEY) {
    console.warn('[x] Please specify a PRIVATE_KEY phrase in your .env file: `PRIVATE_KEY="..."`');
    return;
  }

  console.log("[i] Setup Wallet");
  const provider = new ethers.providers.JsonRpcProvider(NETWORKS.POLYGON.RPC, NETWORKS.POLYGON.CHAINID);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);

  // get Route
  console.log("[i] Requesting route");
  const routeRequest = {
    fromChainId: SETTINGS.FROM.CHAINID,
    fromAmount: SETTINGS.AMOUNT.toString(),
    fromTokenAddress: SETTINGS.FROM.TOKEN_ADDRESSES.USDT,
    toChainId: SETTINGS.TO.CHAINID,
    toTokenAddress: SETTINGS.TO.TOKEN_ADDRESSES.USDT,
    options: { slippage: SETTINGS.SLIPPAGE },
  };

  const routeResponse = await Lifi.getRoutes(routeRequest);
  const route = routeResponse.routes[0];
  console.log("[i] Getting route");
  console.log(route);

  console.log("[i] Starting Execution");
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
      console.log("[i] Switching Chains");
      const provider = new ethers.providers.JsonRpcProvider(SETTINGS.TO.RPC, requiredChainId);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);
      return wallet;
    },
  };
  await Lifi.executeRoute(wallet, route, settings);
  console.log("[i] Done!");
}

main();