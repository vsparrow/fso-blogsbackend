const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// ********************************************************** variables and helper functions

// ********************************************************** ROUTING start
blogsRouter.get('/', async (request, response, next) => {  
	try{
		const blogs = await Blog.find({})
		response.json(blogs)
	} catch(exception){	next(exception)	}	
})

blogsRouter.post('/',  async (request, response, next) => {  
	try{
		const body = request.body
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


module.exports = blogsRouter