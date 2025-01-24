const bcrypt = require('bcrypt')
const router = require('express').Router()

const { User, Blog } = require('../models')
const { tokenExtractor, isAdmin } = require('../utils/middleware')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const { username, password, name } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username.toLowerCase(),
        name,
        passwordHash
    })

    const savedUser = await user.save()
    res.json(savedUser)
})

router.get('/:id', async (req, res) => {
    const where = {}

    if (req.query.read === 'true') {
        where.read = true
    } else if (req.query.read === 'false') {
        where.read = false
    }

    const user = await User.findByPk(req.params.id, {
        attributes: ['username', 'name'],
        include: {
            model: Blog,
            as: 'readings',
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
            through: {
                attributes: ['id', 'read'],
                as: 'readingLists',
                where
            }
        }
    })
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ error: 'User not found' })
    }
})

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
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
        if (req.body.disabled) {
            user.disabled = req.body.disabled
        }
        await user.save()
        res.json(user)
    } else {
        res.status(404).json({ error: 'User not found' })
    }
})

module.exports = router