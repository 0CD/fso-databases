const jwt = require('jsonwebtoken')

const { SECRET } = require('../utils/config')
const { User } = require('../models')

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

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user.admin) {
        return res.status(401).json({ error: 'Operation not allowed' })
    }
    next()
}

module.exports = { errorHandler, tokenExtractor, isAdmin }
