const logger = require('./logger')

const requestLogger = (request, response, next) => {
	logger.info('---')
	logger.info('Method:', request.method)
	logger.info('Path  :', request.path)
	logger.info('Body  :', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request,response) => {
	response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => { 
	if(error.name === 'CastError' && error.kind === 'ObjectId'){ return response.status(400).json({error: "malformed id"})}
	console.log(error)
	console.log("*********************************")
	
	
	logger.error(error.message)
	next(error)
}

// *******************************************
const tokenExtractor = async (request, response, next)=>{
	const authorization = request.get('authorization')
	if(authorization && authorization.toLowerCase().startsWith('bearer'))
		{ request.token =  authorization.substring(7)}
	else {request.token = null}
	next()
}
// *******************************************
module.exports = {requestLogger,unknownEndpoint, errorHandler, tokenExtractor}