const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// ********************************************************** variables and helper functions
const blogs = [      {_id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0}]

// ********************************************************** ROUTING start
blogsRouter.get('/', async (request, response, next) => {  
	try{
		const blogs = await Blog.find({})
		response.json(blogs)
	} catch(exception){	next(exception)	}	
})

blogsRouter.post('/', async (request, response) => {  
	const blog = request.body	
	await blogs.push(blog)
	response.status(201).json(blog)
})


module.exports = blogsRouter