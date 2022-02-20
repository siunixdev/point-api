const express = require("express")
const cors = require("cors")
const cookieSession = require("cookie-session")
const dotenv = require('dotenv')
const db = require("./app/models")
const dbConfig = require("./app/config/db.config")
const initialData = require('./app/config/initialData.config')

dotenv.config()

const app = express()
app.use(cors())

// parse request of content-type - application/json
app.use(express.json())

// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}))


db.mongoose
  .connect(dbConfig.ATLAS_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB");
    initialData()
  })
  .catch(err => {
    console.error(`Connection Error : ${err}`);
    process.exit()
  })

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