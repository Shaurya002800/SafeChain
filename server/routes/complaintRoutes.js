const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload")

const {
  createComplaint,
  getComplaintStatus
} = require("../controllers/complaintController")

router.post(
  "/report",
  upload.single("evidence"),
  createComplaint
)

router.get(
  "/status/:id",
  getComplaintStatus
)

module.exports = router