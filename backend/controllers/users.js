const bcrypt = require('bcrypt')
const axios = require('axios')

const router = require('express').Router()

const User = require('../models/user')
const { WECHAT_APPID, WECHAT_SECRET } = require('../utils/config')

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
  res.status(201).json(user)
})

router.post('/wechat', async (req, res) => {
  const { code, password } = req.body
  const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`)
  const { openid } = response.data
  const newUser = {...req.body, openid}
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
  res.status(201).json(user)
})

router.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).end()
  }
  res.json(user)
})

router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }
  const { password } = req.body
  const updatedUser = {...req.body}
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


