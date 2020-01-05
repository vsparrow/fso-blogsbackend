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

describe("GET BLOG (single)", () => {
	test('can get a blog using a valid id', async () => {
		const blogs = await helper.blogsInDb()
		const blog = blogs[0]
		const result = await api.get(`/api/blogs/${blog.id}`).expect(200).expect('Content-Type', /application\/json/)
		expect(result.body.id).toEqual(blog.id)
		expect(result.body.url).toEqual(blog.url)
		expect(result.body.author).toEqual(blog.author)
		expect(result.body.likes).toEqual(blog.likes)
	})
	
	test('an id of improper length gives an error', async () => {
		const result = await api.get('/api/blogs/100').expect(400).expect('Content-Type', /application\/json/)
		expect(result.body.error).toBe('malformed id')
	})
	
	test('an id that does not exist returns a 404', async () => {
		const blogs = await helper.blogsInDb()
		let id = blogs[0].id
		let badid = "a" + id.slice(1) // 
		const result = await api.get(`/api/blogs/${badid}`).expect(404)
	})
})

describe("POST BLOG", () => {
	
	test("can post a blog", async () => {
		await api.post('/api/blogs').send(helper.singleBlog).expect(201).expect('Content-Type', /application\/json/)
		const blogs = await helper.blogsInDb()
		expect(JSON.stringify(blogs)).toContain(helper.singleBlog.title)	//we could also map the title
	})

	test("count of blogs increaed by one", async () => {
		await api.post('/api/blogs').send(helper.singleBlog)
		const blogs = await helper.blogsInDb()
		expect(blogs.length).toBe(helper.initialBlogs.length + 1)
	})
	
	test("posts without a likes key is set to zero", async () => {
		const blog = helper.singleBlog
		delete blog.likes
		expect(blog.likes).toBeUndefined()
		const result = await api.post('/api/blogs').send(blog)
		expect(result.body.likes).toBe(0)
	})
	
	test("posts without title or url are rejected", async () => {
		let blog = helper.singleBlog
		delete blog.title
		await api.post('/api/blogs').send(blog).expect(400)

		blog = helper.singleBlog
		delete blog.url
		await api.post('/api/blogs').send(blog).expect(400)
	})
})

describe("DELETE BLOG", () => {
	test('succeeds with status code 204 if id is valid', async () => {
		let blogInput={title: "title to delete", url: "no url", author: "no author"}
		const result = await api.post('/api/blogs').send(blogInput)
		const blog = result.body
		let blogs = await helper.blogsInDb()
		expect(blogs.length).toBe(helper.initialBlogs.length + 1)
		await api.delete(`/api/blogs/${blog.id}`).expect(204)
		blogs = await helper.blogsInDb()
		expect(blogs.length).toBe(helper.initialBlogs.length)
		const titles = blogs.map(b => b.title)
		expect(titles.includes(blog.title)).toEqual(false)
	})
})

afterAll(() => mongoose.connection.close())
