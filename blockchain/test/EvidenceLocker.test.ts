import { expect } from "chai";
import hre from "hardhat";

describe("EvidenceLocker", function () {
  it("Should anchor and verify evidence", async function () {
    // Deploy the contract
    const EvidenceLocker = await hre.ethers.getContractFactory("EvidenceLocker");
    const locker = await EvidenceLocker.deploy();
    await locker.waitForDeployment();
    
    // Create test data
    const reportId = "TEST-001";
    const testCid = "QmTestCid123";
    const hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes(testCid));
    
    // Anchor evidence
    await locker.anchorEvidence(reportId, hash);
    
    // Verify it exists
    expect(await locker.verifyEvidence(hash)).to.equal(true);
    
    // Check count
    expect(await locker.getEvidenceCount(reportId)).to.equal(1);
    
    console.log("✅ Test passed! Contract works correctly!");
  });
});