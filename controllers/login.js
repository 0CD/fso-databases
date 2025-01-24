const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({
        where: {
            username: username.toLowerCase()
        }
    })

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)


    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Invalid username or password'
        })
    }

    if (user.disabled) {
        return response.status(401).json({
            error: 'Account disabled, please contact admin'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    await Session.destroy({ where: { userId: user.id } })
    await Session.create({ token, userId: user.id })

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = router