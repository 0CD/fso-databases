const express = require('express')
require('express-async-errors');
const app = express()

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const { errorHandler } = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readingLists')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)

app.use(errorHandler)

const start = async () => {
    await connectToDatabase()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()