import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const pk = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: process.env.AMOY_RPC_URL || "",
      accounts: pk ? [`0x${pk}`] : [],
    },
  },
};

export default config;