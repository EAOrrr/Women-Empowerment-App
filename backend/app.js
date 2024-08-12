const express = require('express')
require('express-async-errors')
const app = express()

const middleware = require('./utils/middleware')
const articlesRouter = require('./controllers/articles')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const notificationRouter = require('./controllers/notifications')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/articles', articlesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)
app.use('/api/notifications', notificationRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app