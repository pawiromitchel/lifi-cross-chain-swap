import NETWORKS from "./networks.js";

const SETTINGS = {
  FROM: NETWORKS.XDAI,
  TO: NETWORKS.POLYGON,
  SLIPPAGE: 0.03,
  AMOUNT: 1000000 / 4 // 0.25 USDT
}

export default SETTINGS;