const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require("./test_helper")
const api = supertest(app)
const path = '/api/users'

beforeEach(async () => {
	await User.deleteMany({})
	await helper.seedUsers()
})

describe("POST USER", () => {
	test("can post a user", async () => {
		const user = helper.singleUser()
		const result = await api.post(path).send(user).expect(200).expect("Content-Type", /application\/json/)
		expect(result.body.username).toBe(user.username)
		expect(result.body.name).toBe(user.name)
		const users = await helper.usersInDb()
		expect(users.length).toBe(helper.initialUsers().length + 1)
	})
	
	test("post user without username or password rejected", async () => {
		let user = helper.singleUser()
		delete user.username
		let result = await api.post(path).send(user).expect(400) 
		expect(result.body.error).toBe("username and password required")
		
		user = helper.singleUser()
		delete user.password
		result = await api.post(path).send(user).expect(400)
		expect(result.body.error).toBe("username and password required")
	})
	
	test("post user with username or password of invalid length rejected", async () => {
		let user = helper.singleUser()
		user.username = "hi"
		let result = await api.post(path).send(user).expect(400) 
		expect(result.body.error).toBe("username and password must be at least 3 characters long")
		
		user = helper.singleUser()
		user.password = "hi"
		result = await api.post(path).send(user).expect(400)
		expect(result.body.error).toBe("username and password must be at least 3 characters long")		
	})
})


afterAll( () => mongoose.connection.close())