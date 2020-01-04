const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async ()=> {
	await Blog.deleteMany({})	
})

describe("GET BLOGS", () => {
	
	test('notes are returned as json', async () => {
		const result = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
		// console.log(result.body)
	})

	test('returns the correct amount of blogs', async () => {
		const results = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
		expect(results.body.length).toBe(0)
	})	
})



afterAll(() => mongoose.connection.close())
