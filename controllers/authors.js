const router = require('express').Router()
const { sequelize } = require('../utils/db')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
        ],
        group: ['author'],
        order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
    })

    res.json(authors)
})

module.exports = router