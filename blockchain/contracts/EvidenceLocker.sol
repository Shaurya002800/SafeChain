// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EvidenceLocker {
    struct EvidenceRecord {
        bytes32 ipfsCidHash; // keccak256 of IPFS CID 
        uint256 timestamp;   // block.timestamp proof 
        string reportId;     // links to Firebase 
    }

    mapping(string => EvidenceRecord[]) public evidenceByReport;
    mapping(bytes32 => bool) public hashAnchored;

    function anchorEvidence(string memory reportId, bytes32 cidHash) public {
        require(!hashAnchored[cidHash], "Already anchored");
        evidenceByReport[reportId].push(EvidenceRecord(cidHash, block.timestamp, reportId));
        hashAnchored[cidHash] = true;
    }

    function verifyEvidence(bytes32 cidHash) public view returns (bool) {
        return hashAnchored[cidHash];
    }
    function getEvidenceCount(string memory reportId) public view returns (uint256) {
    return evidenceByReport[reportId].length;
}
}