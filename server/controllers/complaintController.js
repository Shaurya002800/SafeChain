const db = require("../config/firebase")
const uploadToIPFS = require("../config/pinata")
const contract = require("../config/blockchain")
const { ethers } = require("ethers")

exports.createComplaint = async (req, res) => {

  try {

    const { description, location } = req.body
    const file = req.file

    let cid = null
    let txHash = null

    if (file) {

      // upload to IPFS
      cid = await uploadToIPFS(file)

      const cidHash = ethers.keccak256(
        ethers.toUtf8Bytes(cid)
      )

      const reportId = "REP_" + Date.now()

      const tx = await contract.anchorEvidence(
        reportId,
        cidHash
      )

      const receipt = await tx.wait()

      txHash = receipt.hash

      await db.collection("complaints").doc(reportId).set({
        reportId,
        description,
        location,
        cid,
        txHash,
        status: "submitted",
        createdAt: new Date()
      })

      return res.json({
        success: true,
        reportId,
        cid,
        txHash
      })
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Complaint creation failed" })
  }

}

exports.getComplaintStatus = async (req, res) => {

  try {

    const { id } = req.params

    const doc = await db.collection("complaints").doc(id).get()

    if (!doc.exists) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json(doc.data())

  } catch (error) {
    res.status(500).json({ error: "Error fetching complaint" })
  }
}