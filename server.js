const express = require("express")
const cors = require("cors")
const cookieSession = require("cookie-session")
const dotenv = require('dotenv')

dotenv.config()
const app = express()
app.use(cors())

// parse request of content-type - application/json
app.use(express.json())

// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}))

app.use(
  cookieSession({
    name: "point-session",
    secret: "COOKIE_SECRET",
  })
)

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Point App"
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})