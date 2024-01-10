require("hardhat-gas-reporter");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: 'USD',
    gasPrice: 23,
    token: 'ETH'
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        blockNumber: 18888888,        
      },
      accounts: {
        count: 10,
      },
    },
  },
};
