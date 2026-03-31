import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EvidenceLockerModule = buildModule("EvidenceLockerModule", (m) => {
  const evidenceLocker = m.contract("EvidenceLocker");

  return { evidenceLocker };
});

export default EvidenceLockerModule;
