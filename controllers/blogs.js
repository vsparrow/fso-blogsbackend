const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
// ********************************************************** variables and helper functions
getTokenFrom = request => {
	const authorization = request.get('authorization')
	if(authorization && authorization.toLowerCase().startsWith('bearer'))
	{return authorization.substring(7)}
	return null
}

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
		const token = getTokenFrom(request)
		try{
			const decodedToken = jwt.verify(token,process.env.SECRET)
			if(!token || ! decodedToken.id)
			{return response.status(401).json({error: 'token missing or invalid'})}
		const user = await User.findById(decodedToken.id)
		const blog =  new Blog({			
			title: body.title, 
			author: body.author, 
			url: body.url, 
			likes: body.likes || 0,
			user: user._id
		})		
	// try{
		if(!body.title || !body.url) { return response.status(400).json({error : "title and url required"})}
		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		response.status(201).json(savedBlog.toJSON())		
	} catch(exception) { next(exception) }	
})

blogsRouter.delete('/:id', async (request,response,next) => {
	try{ 
		const id = request.params.id
		const blog = (await Blog.findById(id))
		const userId = blog.user
		const result  = await Blog.findOneAndDelete({_id: id})
		// remove the blog id from user's blog array' ***************************
		const user = await User.findById(userId)
		const updatedUserBlogs = user.blogs.filter(b => b != id)
		user.blogs = updatedUserBlogs
		await user.save()
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