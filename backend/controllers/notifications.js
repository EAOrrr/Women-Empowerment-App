const router = require('express').Router()

const { Notification, User } = require('../models')
const { userExtractor, authorize, checkFields } = require('../utils/middleware')

router.get('/', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  // console.log('req.user', req.user)
  const notifications = await Notification.findAll({
    where: {
      userId: req.user.id
    },
    attributes: {
      exclude: ['userId']
    }
  })
  res.json(notifications)
})

router.post('/',
  userExtractor,
  authorize(['admin']),
  async (req, res) => {
    const { message } = req.body
    const users = await User.findAll()
    await Promise.all(users.map(user =>
      Notification.create({
        message,
        userId: user.id,
        type: 'global',
      })
    ))
    res.json({
      message
    })
  })

router.put('/:id',
  userExtractor,
  authorize(['admin', 'user']),
  checkFields(['read', 'id']),
  async (req, res) => {
    const notification = await Notification.findByPk(req.params.id)
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }
    if (notification.userId !== req.user.id) {
      return res.status(403).json({
        error: 'You are not allowed to update this notification'
      })
    }
    await notification.update(req.body)
    res.json(notification)
  })

router.delete('/:id',
  userExtractor,
  authorize(['user', 'admin']),
  async (req, res) => {
    const notification = await Notification.findByPk(req.params.id)
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found'
      })
    }
    if (notification.userId !== req.user.id) {
      return res.status(403).json({
        error: 'You are not allowed to delete this notification'
      })
    }
    await notification.destroy()
    res.status(204).end()
  })


module.exports = router