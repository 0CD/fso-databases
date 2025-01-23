const bcrypt = require('bcrypt')
const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const { username, password, name } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)
})

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ error: 'User not found' })
    }
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })
    if (user) {
        if (req.body.username) {
            user.username = req.body.username
        }
        if (req.body.password) {
            const saltRounds = 10
            user.passwordHash = await bcrypt.hash(req.body.password, saltRounds)
        }
        if (req.body.name) {
            user.name = req.body.name
        }
        await user.save()
        res.json(user)
    } else {
        res.status(404).json({ error: 'User not found' })
    }
})

module.exports = router