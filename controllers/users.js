const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
	const result = await User.find({})
	response.json(result)
})

//username password, name
usersRouter.post('/', async (request, response, next) => {
	try {
		const body = request.body
		
		if(!body.username || !body.password)
			{return response.status(400).json({error: "username and password required"})}
		if(body.username.length < 3 || body.password.length < 3)
			{return response.status(400).json({error: "username and password must be at least 3 characters long"})}
		// ****************************************ttime to test
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(body.password, saltRounds)
		const user = new User({username: body.username, name: body.name, passwordHash})
		const savedUser = await user.save()
		response.json(savedUser)
	} catch(exception) { next(exception) }
})

module.exports = usersRouter