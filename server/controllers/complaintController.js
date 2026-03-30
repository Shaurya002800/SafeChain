const db = require("../config/firebase")
const uploadToIPFS = require("../config/pinata")
const contract = require("../config/blockchain")
const { ethers } = require("ethers")

exports.createComplaint = async (req, res) => {

  try {
    console.log("createComplaint called", { bodyKeys: Object.keys(req.body), hasFile: !!req.file })

    const { description, location, type } = req.body
    const file = req.file

    // Basic validation
    if (!description || !type) {
      return res.status(400).json({ error: "Missing required fields: type and description are required." })
    }

    let cid = null
    let txHash = null

    if (file) {

      // upload to IPFS
      cid = await uploadToIPFS(file)

      const cidHash = ethers.keccak256(
        ethers.toUtf8Bytes(cid)
      )

      const reportId = "REP_" + Date.now()

      // Try to anchor on-chain if possible. If anchoring fails (for example
      // because CONTRACT_ADDRESS isn't set or blockchain node isn't available),
      // don't crash the whole request — store the CID and return success with
      // a note that anchoring is pending.
      try {
        const tx = await contract.anchorEvidence(
          reportId,
          cidHash
        )

        const receipt = await tx.wait()

        txHash = receipt.hash
      } catch (err) {
        console.error('Anchoring failed, saving report without txHash:', err && err.message ? err.message : err)
        txHash = null
      }

      await db.collection("complaints").doc(reportId).set({
        reportId,
        description,
        location,
        cid,
        txHash,
        status: txHash ? "submitted" : "submitted_pending_anchor",
        createdAt: new Date()
      })

      return res.json({
        success: true,
        reportId,
        cid,
        txHash,
        message: txHash ? 'Anchored on-chain' : 'Uploaded to IPFS; anchoring pending or failed'
      })
    }

    // If no file was uploaded, still create a report record (evidence optional).
    // This keeps the API usable when clients submit text-only reports.
    const reportId = "REP_" + Date.now()
    await db.collection("complaints").doc(reportId).set({
      reportId,
      type,
      description,
      location,
      cid: null,
      txHash: null,
      status: "submitted",
      createdAt: new Date()
    })

    return res.json({
      success: true,
      reportId,
      cid: null,
      txHash: null,
      message: "Report created without evidence file"
    })

  } catch (error) {
    console.error("createComplaint error:", error)
    // Return a descriptive JSON error so client can surface it.
    res.status(500).json({ error: "Complaint creation failed", detail: error.message || error.toString() })
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