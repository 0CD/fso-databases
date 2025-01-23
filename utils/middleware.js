const jwt = require('jsonwebtoken')

const { SECRET } = require('../utils/config')

const errorHandler = (error, request, response, next) => {
    console.error('Error:', error.message)

    if (error.name === 'SequelizeValidationError') {
        return response.status(400).json({
            error: error.errors.map(e => e.message)
        })
    }

    if (error instanceof SyntaxError) {
        return response.status(400).json({ error: 'Malformed JSON' })
    }

    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'Token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'Token missing' })
    }
    next()
}

module.exports = { errorHandler, tokenExtractor }
