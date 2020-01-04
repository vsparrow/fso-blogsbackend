const Blog = require('../models/blog')
const initialBlogs = require('./initialBlogs')

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const seedBlogs = async () => {
	// const promiseArray =  initialBlogs.forEach(blog => { const b = new Blog(blog); b.save()  })	
	const blogObjects = initialBlogs.map(blog => new Blog(blog))
	const promiseArray = blogObjects.map(b=>b.save())
	await Promise.all(promiseArray)
}

module.exports = {initialBlogs, blogsInDb, seedBlogs}
