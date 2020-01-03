require("dotenv").config()

let PORT = process.env.PORT || 3003
let MONGODB_URI = process.env.MONGODB_URI
let TEST_MONGODB_URI = process.env.TEST_MONGODB_URI

module.exports = {PORT, MONGODB_URI, TEST_MONGODB_URI}
