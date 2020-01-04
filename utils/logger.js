// sendto an external logging service like graylog or papertrail in future revisions

const info = (...params) => {
	if(process.env.NODE_ENV !== 'test'){console.log(...params)}
}

const error = (...params) => {
	console.error(...params)
}

module.exports = {info, error}