const router = require('express').Router()

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        attributes: {
            exclude: ['userId'],
        },
        include: {
            model: User,
            attributes: ['name']
        }
    })
    res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).json({ error: 'Blog not found' })
    }
})

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findOne({ where: { id: req.decodedToken.id } })
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
    res.json(blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    if (!req.blog) {
        return res.status(404).json({ error: 'Blog not found' })
    }

    if (req.blog.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    await req.blog.destroy()
    res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        await req.blog.update(req.body)
        res.json(req.blog)
    } else {
        res.status(404).json({ error: 'Blog not found' })
    }
})

module.exports = router