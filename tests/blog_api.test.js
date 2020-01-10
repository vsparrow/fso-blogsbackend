const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require("./test_helper")
const api = supertest(app)
let token = ''
beforeEach(async ()=> {
	jest.setTimeout(10000)
	token = ''
	await Blog.deleteMany({})
	await User.deleteMany({})
	await helper.seedBlogs()
	//create a user
	let user = helper.singleUser()
	await api.post('/api/users').send(user)
	let login = (await api.post('/api/login').send(user)).body
	token = login.token
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
		const singleBlog = helper.singleBlog()
		const posting = await api.post('/api/blogs').set('Authorization', "Bearer "+token).send(singleBlog).expect(201).expect('Content-Type', /application\/json/)
		const blogs = await helper.blogsInDb()
		expect(JSON.stringify(blogs)).toContain(singleBlog.title)	//we could also map the title
	})

	test("count of blogs increased by one", async () => {
		const singleBlog = helper.singleBlog()
		await api.post('/api/blogs').set('Authorization', "Bearer "+token).send(singleBlog).expect(201).expect('Content-Type', /application\/json/)

		const blogs = await helper.blogsInDb()
		expect(blogs.length).toBe(helper.initialBlogs.length + 1)
	})
	
	test("posts without a likes key is set to zero", async () => {
		const blog = helper.singleBlog()
		delete blog.likes
		expect(blog.likes).toBeUndefined()
		const result = await api.post('/api/blogs').set('Authorization', "Bearer "+token).send(blog)
		expect(result.body.likes).toBe(0)
	})
	
	test("posts without title or url are rejected", async () => {
		let blog = helper.singleBlog()
		delete blog.title
		await api.post('/api/blogs').set('Authorization', "Bearer "+token).send(blog).expect(400)

		blog = helper.singleBlog()
		delete blog.url
		await api.post('/api/blogs').set('Authorization', "Bearer "+token).send(blog).expect(400)
	})
})

describe("DELETE BLOG", () => {
	
	test('succeeds with status code 204 if token is valid', async () => {
		let blogInput={title: "title to delete", url: "no url", author: "no author"}
		const result = await api.post('/api/blogs').set('Authorization', "Bearer "+token).send(blogInput)
		const blog = result.body
		let blogs = await helper.blogsInDb()
		expect(blogs.length).toBe(helper.initialBlogs.length + 1)
		await api.delete(`/api/blogs/${blog.id}`).set('Authorization', "Bearer "+token).expect(204)
		blogs = await helper.blogsInDb()
		expect(blogs.length).toBe(helper.initialBlogs.length)
		const titles = blogs.map(b => b.title)
		expect(titles.includes(blog.title)).toEqual(false)
	})
	
	test("user's blog array updated after blog delete", async () => {
		const blog = helper.singleBlog()
		// blog.userId = await helper.getAUserId()
		//post blog
		const postedBlog = (await api.post('/api/blogs').set('Authorization', "Bearer "+token).send(blog)).body
		const blogId = postedBlog.id
		//delete blog
		await api.delete(`/api/blogs/${blogId}`).set('Authorization', "Bearer "+token).expect(204)
		//cehck to see if user blog array does not contain id
		// const user = await User.findById(blog.userId)
		const user = await User.findOne({username: await helper.singleUser().username})
		expect(JSON.stringify(user.blogs)).not.toContain(blogId)
	})
	
	test("delete returns 400 if id is invalid", async () => {
		let blogs = await helper.blogsInDb()
		let id = blogs[0].id
		let badId = id.slice(1)
		await api.delete(`/api/blogs/${badId}`).expect(400)
	})
	
	//test for id valid length but not exist - add after adding user auth
}) //delete

describe("PUT", () => {
	test("a blog can be updated", async () => {
		const blogs = await helper.blogsInDb()
		const blog = blogs[0]
		const id = blog.id
		const singleBlog = helper.singleBlog()
		singleBlog.likes = 10000000
		const result = await api.put(`/api/blogs/${id}`).send(singleBlog).expect(200).expect("Content-Type", /application\/json/)
		const newBlog = (await api.get(`/api/blogs/${id}`)).body

			
		expect(newBlog.title).toBe(singleBlog.title)
		expect(newBlog.url).toBe(singleBlog.url)
		expect(newBlog.author).toBe(singleBlog.author)
		expect(newBlog.likes).toBe(singleBlog.likes)							
		
		expect(newBlog.title).not.toBe(blog.title)
		expect(newBlog.url).not.toBe(blog.url)
		expect(newBlog.author).not.toBe(blog.author)
		expect(newBlog.likes).not.toBe(blog.likes)
	})
	
	test("blog update without title or url cannot be updated", async () => {
		const blogs = await helper.blogsInDb()
		const blog = blogs[0]
		const id = blog.id
		
		let newData = helper.singleBlog()
		delete newData.title
		await api.put(`/api/blogs/${id}`).send(newData).expect(400)
		
		newData = helper.singleBlog()
		delete newData.url
		await api.put(`/api/blogs/${id}`).send(newData).expect(400)		
	})
	
	test("blog update without likes has it set to 0", async () => {
		const blogs = await helper.blogsInDb()
		const blog = blogs[0]
		const id = blog.id
		
		let newData = helper.singleBlog()
		delete newData.likes
		const result = (await api.put(`/api/blogs/${id}`).send(newData).expect(200).expect('Content-Type', /application\/json/)).body
		expect(result.likes).toBe(0)
	})
}) //put

afterAll(() => mongoose.connection.close())
