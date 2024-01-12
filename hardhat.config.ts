import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "./tasks/generateDiamondABI.ts";

dotenv.config();

const { INFURA_API_KEY, DEPLOYER_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        blockNumber: 18888888,
      },
      accounts: {
        count: 10,
      },
    },
  },
};

export default config;
