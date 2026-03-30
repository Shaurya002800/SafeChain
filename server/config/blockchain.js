const { ethers } = require("ethers")
require("dotenv").config()

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL)

const wallet = new ethers.Wallet(
  process.env.WALLET_PRIVATE_KEY,
  provider
)

const contractABI = [
  "function anchorEvidence(string reportId, bytes32 cidHash) public",
  "function verifyEvidence(bytes32 cidHash) view returns (bool)"
]

const contractAddress = process.env.CONTRACT_ADDRESS

let contract

if (!contractAddress || contractAddress === "not_deployed_yet") {
  console.warn(
    "Warning: CONTRACT_ADDRESS is not set or is a placeholder. Blockchain contract functions will throw if called."
  )

  // Export a stub that matches the interface but throws useful errors at runtime.
  contract = {
    anchorEvidence: async () => {
      throw new Error(
        "Contract not deployed: set CONTRACT_ADDRESS in server/.env to the deployed contract address before calling blockchain functions."
      )
    },
    verifyEvidence: async () => {
      throw new Error(
        "Contract not deployed: set CONTRACT_ADDRESS in server/.env to the deployed contract address before calling blockchain functions."
      )
    }
  }
} else {
  contract = new ethers.Contract(contractAddress, contractABI, wallet)
}

module.exports = contract