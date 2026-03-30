
const express = require("express")
const cors = require("cors")
require("dotenv").config()

const complaintRoutes = require("./routes/complaintRoutes")

const app = express()

app.use(cors())
app.use(express.json())

// Basic root route so visiting / in a browser returns a helpful message.
app.get("/", (req, res) => {
  return res.send("SafeChain backend running. Use /api/complaints for API routes.")
})

app.use("/api/complaints", complaintRoutes)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})