const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const Blog = require('../models/blog') 
const User = require('../models/user')
const helper = require("./test_helper")
const api = supertest(app)
const url = '/api/login'

beforeEach(async ()=> {
	await User.deleteMany({})
	//we post rather than save user directly else would have to create passwordHash in the test. 
	// If we made changes to how we encrpt it would not reflect automatically here
	// await new User(await helper.singleUser()).save() //<-bad
	await api.post('/api/users').send(await helper.singleUser())
})

describe('POST Login', ()=>{
	test('successful login returns a token', async ()=>{
		const user = await helper.singleUser()
		const userData = {username: user.username, password: user.password}
		const result = await api.post(url).send(userData).expect(200).expect("Content-Type", /application\/json/)
		expect(result.body).toHaveProperty("token")
	})
	
	test('bad password returns error', async ()=>{
		const user = await helper.singleUser()
		const userData = {username: user.username, password: user.password + 'a'}
		const result = await api.post(url).send(userData).expect(401).expect("Content-Type", /application\/json/)
		expect(result.body).not.toHaveProperty("token")		
		expect(result.body).toHaveProperty("error")		
	})
	test('invalid username returns error', async ()=>{
		const user = await helper.singleUser()
		const userData = {username: user.username+'a', password: user.password}
		const result = await api.post(url).send(userData).expect(401).expect("Content-Type", /application\/json/)
		expect(result.body).not.toHaveProperty("token")		
		expect(result.body).toHaveProperty("error")		
	})	
	
})	

afterAll(() => mongoose.connection.close())