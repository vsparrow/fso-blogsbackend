const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
// ********************************************************** variables and helper functions

// ********************************************************** ROUTING start
blogsRouter.get('/', async (request, response, next) => {  
	try{
		const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
		response.json(blogs)
	} catch(exception){	next(exception)	}	
})

blogsRouter.get('/:id', async (request,response,next) => {
	try{
		const id = request.params.id
		const blog = await Blog.findById(id)
		if(blog){response.json(blog.toJSON())}
		else{ response.status(404).end()}		
	} catch(exception) { next(exception) }
})

blogsRouter.post('/',  async (request, response, next) => {  
		const body = request.body
		const user = await User.findById(body.userId)
		// console.log("*****************user is", user)
		const newBlog =  new Blog({			
			title: body.title, 
			author: body.author, 
			url: body.url, 
			likes: body.likes || 0,
			user: user._id
		})		
	try{
		if(!body.title || !body.url) { return response.status(400).json({error : "title and url required"})}
		const result = await newBlog.save()
		// console.log("***********result is", result)
		user.blogs = user.blogs.concat(result._id)
		await user.save()
		response.status(201).json(result.toJSON())		
	} catch(exception) { next(exception) }	
})

blogsRouter.delete('/:id', async (request,response,next) => {
	try{ //something wrong after makeingchanges, fix this
		const id = request.params.id
		const blog = (await Blog.findById(id))
		// console.log(blog)
		const userId = blog.user
		// console.log("user id is ",userId)
		const result  = await Blog.findOneAndDelete({_id: id})
		//************************
		// remove the blog id from user's blog array' ***************************
		const user = await User.findById(userId)
		// console.log("user.blogs before:", user.blogs)
		const updatedUserBlogs = user.blogs.filter(b => b != id)
		// console.log("updatedUserBlogs.length is now",updatedUserBlogs)
		user.blogs = updatedUserBlogs
		await user.save()
		// console.log(user)
		// console.log(updatedUserBlogs.length)
		//************************
		logger.info("Record deleted", result)
		response.status(204).end()				
	} catch(exception) { next(exception) }
})

blogsRouter.put('/:id', async (request,response,next) => {
	try{
		const id = request.params.id
		const body = request.body
		if(!body.title || !body.url) {return response.status(400).json({error: "title and url required"})}
		const updatedBlog = {title: body.title, url: body.url, author: body.author, likes: body.likes || 0}
		const result = await Blog.findByIdAndUpdate(id, updatedBlog, {new: true})
		response.json(result)
	} catch(exception) { next(exception) }
})

module.exports = blogsRouter