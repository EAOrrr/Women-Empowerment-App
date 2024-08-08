const bcrypt = require('bcrypt')
const axios = require('axios')

const router = require('express').Router()

const User = require('../models/user')
const { WECHAT_APPID, WECHAT_SECRET } = require('../utils/config')
const { userExtractor, authorize } = require('../utils/middleware')

router.post('/pwd', async (req, res) => {
  const { username, password, role } = req.body

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: `User validation failed:
         Path password is shorter 
         than the minimum allowed length (6)` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({ username, password:passwordHash, role })
  const userForResponse = {
    username: user.username,
    userId: user.id
  }
  res.status(201).json(userForResponse)
})

router.post('/wechat', async (req, res) => {
  const { code, password } = req.body
  const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`)
  const { openid } = response.data
  const newUser = { ...req.body, openid }
  if (password) {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: `User validation failed:
          Path password is shorter 
          than the minimum allowed length (6)` })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    newUser.password = passwordHash
  }
  const user = await User.create(newUser)
  const userForResponse = {
    username: user.username,
    userId: user.id
  }
  res.status(201).json(userForResponse)
})

router.get('/', userExtractor, authorize(['user', 'admin']), async (req, res) => {
  const user = req.user
  const returnedUser = {
    phone: user.phone,
    avatar: user.avatar,
    username: user.username,
    userId: user.id
  }
  res.json(returnedUser)

})


// TODO test
router.get('/:username', userExtractor, authorize(['admin']), async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    },
    attributes: { exclude: ['password', 'role'] }
  })
  if (!user) {
    return res.status(404).end()
  }
  res.json(user)
})

router.put('/', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const body = req.body
  const user = req.user
  if (body.role && user.role !== 'admin') {
    return res.status(403).json({ error: 'role can only be changed by admin' })
  }
  const { password } = req.body
  const updatedUser = { ...req.body }
  if (password) {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: `User validation failed:
          Path password is shorter 
          than the minimum allowed length (6)` })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    updatedUser.password = passwordHash
  }

  await user.update(updatedUser)
  res.json(user)
})

module.exports = router


