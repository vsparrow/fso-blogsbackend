const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
// mongoose.set('useFindAndModify', false);
// ********************************************************** Mongoose connection
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(() => {logger.info('connected to MongoDB')})
.catch(error => logger.error('error connecting to MongoDB:', error.message))

// ********************************************************** app.use start.
app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app