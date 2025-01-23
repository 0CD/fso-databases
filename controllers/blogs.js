const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    // console.log('GET:', JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        // console.log('GET:', JSON.stringify(req.blog, null, 2))
        res.json(req.blog)
    } else {
        res.status(404).json({ error: 'Blog not found' })
    }
})

router.post('/', async (req, res) => {
    const blog = await Blog.create(req.body)
    // console.log('POST:', JSON.stringify(blog, null, 2))
    res.json(blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        await req.blog.destroy()
        // console.log('DELETE:', JSON.stringify(req.blog, null, 2))
        res.status(204).end()
    } else {
        res.status(404).json({ error: 'Blog not found' })
    }
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        await req.blog.update(req.body)
        // console.log('PUT:', JSON.stringify(req.blog, null, 2))
        res.json(req.blog)
    } else {
        res.status(404).json({ error: 'Blog not found' })
    }
})

module.exports = router