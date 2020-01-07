const Blog = require('../models/blog')
const initialBlogs = require('./initialBlogs')
const User = require('../models/user')

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

// **************************************************
const initialUsers = () => {return [
	{username: "rmcdonald", name: "Ronald McDonald", password:"hamburger"},
	{username: "wendys", name: "miss wendy", password:"frosty"}
]}

const seedUsers = async () => {
	const userObjects = initialUsers().map(u => new User(u))
	const promiseArray = userObjects.map(u => u.save())
	await Promise.all(promiseArray)
}

const singleUser = () => { return {username:"dominos", name:"dominos pizza", password: "delivery"}}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
} 

const getAUserId = async () => {
	const user = await new User(singleUser()).save()
	// return JSON.stringify(user._id)
	return user._id
}

module.exports = {initialBlogs, blogsInDb, seedBlogs, singleBlog, initialUsers, seedUsers, singleUser, usersInDb, getAUserId}
