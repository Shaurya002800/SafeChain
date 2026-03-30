const express = require("express")
const app = express()

app.use(express.json())

const complaintRoutes = require("./routes/complaintRoutes")

app.use("/api/complaints", complaintRoutes)

const PORT = 5000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})