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

const singleBlog = () =>  {return {
  title: "Singleblog string reduction",
  author: "Edsger W. Single",
  url: "http://single.github.com",	
  likes: 12
}}

module.exports = {initialBlogs, blogsInDb, seedBlogs, singleBlog}
