const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload")

const {
  createComplaint,
  getComplaintStatus
} = require("../controllers/complaintController")

// Helpful GET handler: the /report endpoint expects a POST with form-data.
router.get("/report", (req, res) => {
  return res.status(405).json({
    error: "Method Not Allowed",
    message: "Use POST /api/complaints/report with form-data (fields: type, description, evidence file optional)"
  })
})

// Simple HTML test form (manual browser testing)
router.get("/report-form", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Test: Submit Report</h2>
        <form method="POST" action="/api/complaints/report" enctype="multipart/form-data">
          <label>Type: <input name="type" /></label><br/>
          <label>Description: <input name="description" /></label><br/>
          <label>Evidence: <input type="file" name="evidence" /></label><br/>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `)
})

// Conditionally apply multer only when request is multipart/form-data.
const conditionalUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || ''
  if (contentType.startsWith('multipart/form-data')) {
    return upload.single('evidence')(req, res, next)
  }
  // not multipart, continue (JSON or other body types are handled by express.json())
  return next()
}

router.post(
  "/report",
  conditionalUpload,
  createComplaint
)

router.get(
  "/status/:id",
  getComplaintStatus
)

module.exports = router