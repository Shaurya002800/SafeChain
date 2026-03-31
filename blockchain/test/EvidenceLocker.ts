import { ethers } from "hardhat";
import { expect } from "chai";

describe("EvidenceLocker", function () {
  async function deploy() {
    const Factory = await ethers.getContractFactory("EvidenceLocker");
    const locker = await Factory.deploy();
    await locker.waitForDeployment();
    return { locker };
  }

  it("should anchor and verify evidence", async function () {
    const { locker } = await deploy();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("QmTestCID123"));
    await locker.anchorEvidence("report-001", hash);
    expect(await locker.verifyEvidence(hash)).to.equal(true);
  });

  it("should reject duplicate anchoring", async function () {
    const { locker } = await deploy();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("QmTestCID456"));
    await locker.anchorEvidence("report-002", hash);
    await expect(
      locker.anchorEvidence("report-002", hash)
    ).to.be.revertedWith("Already anchored");
  });

  it("should return false for unknown hash", async function () {
    const { locker } = await deploy();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("QmFake"));
    expect(await locker.verifyEvidence(hash)).to.equal(false);
  });
});
