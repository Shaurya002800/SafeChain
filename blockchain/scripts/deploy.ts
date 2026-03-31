import { ethers } from "hardhat";

async function main() {
  console.log("Deploying EvidenceLocker contract...");

  const EvidenceLocker = await ethers.getContractFactory("EvidenceLocker");
  const locker = await EvidenceLocker.deploy();
  
  await locker.waitForDeployment();
  
  const address = await locker.getAddress();
  
  console.log("✅ EvidenceLocker deployed to:", address);
  console.log("🔗 View on PolygonScan:");
  console.log(`https://amoy.polygonscan.com/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });