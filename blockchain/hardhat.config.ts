import type { HardhatUserConfig } from "hardhat/config";
// Use the installed toolbox package (this project has the mocha-ethers variant installed)
import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "dotenv/config";

const pk = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");

const config: HardhatUserConfig = {
  // Use a compiler compatible with contracts/*.sol pragmas (Counter.sol uses ^0.8.28)
  solidity: "0.8.28",
  networks: {
    amoy: {
      type: "http",
      url: process.env.AMOY_RPC_URL || "",
      accounts: pk ? [`0x${pk}`] : [],
    },
  },
};

export default config;