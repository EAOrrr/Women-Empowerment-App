const jwt = require('jsonwebtoken')
const logger = require('./logger')
const { User } = require('../models')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, req, res, next) => {
  console.log('From errorHandler:', error.name, error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: `${err.path} must be unique`
    }))
    return res.status(400).send({ errors })
  } else if (error.name === 'SequelizeValidationError') {
    console.log('error')
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    console.log(error.message)
    return res.status(400).send({ error: error.message })
  }

  next()
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const userExtractor = async (req, res, next) => {
  const token = getTokenFrom(req)

  if (!token) {
    // return res.status(401).json({ error: 'token missing' })
    req.user = { role: 'guest' }
    return next()
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findByPk(decodedToken.id)

  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }

  req.user = user

  next()
}

const authorize = (roles = null) => {
  return (req, res, next) => {
    console.log(req.user.role, roles)
    if (!req.user) {
      return res.status(401).json({ error: 'token missing' })
    }
    if (roles && !roles.includes(req.user.role) ) {
      return res.status(403).json({ error: 'unauthorized' })
    }
    next()
  }
}


const unknownEndpoint = (req, res) => {
  res.status(404).send('unknown endpoint')
}

module.exports = {
  requestLogger,
  errorHandler,
  userExtractor,
  authorize,
  unknownEndpoint
}
