const Blog = require('../models/blog')
const initialBlogs = require('./initialBlogs')

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const seedBlogs = async () => {
	const blogObjects = initialBlogs.map(blog => new Blog(blog))
	const promiseArray = blogObjects.map(b=>b.save())
	await Promise.all(promiseArray)
}

const singleBlog = {
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "http://www.github.com",	
  likes: 12
}

module.exports = {initialBlogs, blogsInDb, seedBlogs, singleBlog}
