const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
// ********************************************************** variables and helper functions

// ********************************************************** ROUTING start
blogsRouter.get('/', async (request, response, next) => {  
	try{
		const blogs = await Blog.find({})
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
	try{
		const body = request.body
		if(!body.title || !body.url) { return response.status(400).json({error : "title and url required"})}
		const newBlog =  new Blog({			
			title: body.title, 
			author: body.author, 
			url: body.url, 
			likes: body.likes || 0
		})
		const result = await newBlog.save()
		response.status(201).json(result.toJSON())		
	} catch(exception) { next(exception) }	
})

blogsRouter.delete('/:id', async (request,response,next) => {
	try{
		const id = request.params.id
		const result  = await Blog.findOneAndDelete({_id: id})
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