const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

// ********************************************************** variables and helper functions
const blogs = [      {_id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0}]
// ********************************************************** app.use start
app.use(cors())
app.use(bodyParser.json())

// ********************************************************** ROUTING start
app.get('/api/blogs', (request, response) => {
  
	response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
  
	const blog = request.body
	console.log(blog)
	await blogs.push(blog)
	response.status(201).json(blog)
})

module.exports = app