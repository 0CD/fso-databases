require('dotenv').config()
const { Sequelize, Model, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model { }
Blog.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: Sequelize.STRING,
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

Blog.sync()

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    console.log('GET:', JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        console.log('GET:', JSON.stringify(blog, null, 2))
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

app.post('/api/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        console.log('POST:', JSON.stringify(blog, null, 2))
        res.json(blog)
    } catch (error) {
        console.error('POST:', error.message)
        res.status(400).end()
    }
})

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await Blog.destroy({ where: { id: req.params.id } })
        console.log('DELETE:', req.params.id)
        res.status(204).end()
    } catch (error) {
        console.error('DELETE:', error.message)
        res.status(400).end()
    }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})