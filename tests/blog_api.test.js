const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require("./test_helper")
const api = supertest(app)

beforeEach(async ()=> {
	await Blog.deleteMany({})
	await helper.seedBlogs()
})

describe("GET BLOGS", () => {
	
	test('notes are returned as json', async () => {
		const result = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)	
	})

	test('returns the correct amount of blogs', async () => {
		const results = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
		expect(results.body.length).toBe(helper.initialBlogs.length)
	})
	
	test("each blog has an id", async () => {
		const blogs = await helper.blogsInDb()
		blogs.forEach(blog => expect(blog.id).toBeDefined())
	})
})

describe("POST BLOG", () => {
	
	test("can post a blog", async () => {
		await api.post('/api/blogs').send(helper.singleBlog).expect(201).expect('Content-Type', /application\/json/)
		const blogs = await helper.blogsInDb()
		expect(JSON.stringify(blogs)).toContain(helper.singleBlog.title)	
	})

	test("count of blogs increaed by one", async () => {
		await api.post('/api/blogs').send(helper.singleBlog)
		const blogs = await helper.blogsInDb()
		expect(blogs.length).toBe(helper.initialBlogs.length + 1)
	})
})

afterAll(() => mongoose.connection.close())
