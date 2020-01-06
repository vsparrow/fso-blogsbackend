const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
	const result = await User.find({})
	response.json(result)
})

module.exports = usersRouter