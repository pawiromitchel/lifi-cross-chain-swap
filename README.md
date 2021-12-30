# Cross chain swaps with LiFi SDK

0. clone the repo, navigate to it and run `npm install`
1. extract your private key from the wallet you want to use
2. use the `config.js` file to add token addresses
3. change the settings in the `lifi.js`

*Please double check how much decimals the token has you want to swap from*
```js
const SETTINGS = {
  FROM: NETWORKS.XDAI,
  TO: NETWORKS.POLYGON,
  SLIPPAGE: 0.03,
  AMOUNT: 1000000 / 4 // 0.25 USDT
}
```

4. run the app `node lifi.js`

Hope it helps and happy coding! 😎

## Sources
https://github.com/lifinance/sdk-node-sample  
https://docs.li.finance/official-documentation/sdk-docs/lifi-sdk  
https://li.finance/swap