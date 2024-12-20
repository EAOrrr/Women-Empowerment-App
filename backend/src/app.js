const express = require('express')
const cors = require('cors')
require('express-async-errors')
require('./utils/clean-images')
const app = express()

const middleware = require('./utils/middleware')
const articlesRouter = require('./controllers/articles')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const notificationRouter = require('./controllers/notifications')
const imagesRouter = require('./controllers/images')
const RecruitmentRouter = require('./controllers/recruitments')


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(middleware.requestLogger)

app.use('/api/articles', articlesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/images', imagesRouter)
app.use('/api/recruitments', RecruitmentRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app