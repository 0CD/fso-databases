const errorHandler = (error, request, response, next) => {
    console.error('Error:', error.message)

    if (error.name === 'SequelizeValidationError') {
        return response.status(400).json({ error: error.message })
    }

    if (error instanceof SyntaxError) {
        return response.status(400).json({ error: 'Malformed JSON' })
    }

    next(error)
}

module.exports = { errorHandler }
