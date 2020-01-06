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
})


afterAll( () => mongoose.connection.close())