const http = require('http')
const app = require('./app')
// require('dotenv').config

const server = http.createServer(app)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})