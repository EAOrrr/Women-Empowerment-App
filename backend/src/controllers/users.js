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

router.get('/me', userExtractor, authorize(['user', 'admin']), async (req, res) => {
  const user = req.user
  const notificationCount = await user.countNotifications({where: {read: false}})
  const returnedUser = {
    phone: user.phone,
    avatar: user.avatar,
    username: user.username,
    userId: user.id,
    notificationCount
  }
  console.log(notificationCount)
  res.json(returnedUser)

})

router.get('/', userExtractor, authorize(['admin']), async (req, res) => {
  const user = await User.findAll({
    attributes: { exclude: ['password', 'role', 'openid'] }
  })
  if (!user) {
    return res.status(404).end()
  }
  res.json(user)
})

router.put('/me', userExtractor, authorize(['admin', 'user']), async (req, res) => {
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

router.get('/me/follows', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const user = req.user
  const articles = await user.getFollowable()

  res.json(articles)

})

router.get('/me/follows/:type', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const user = req.user
  const { type } = req.params
  if (type === 'articles') {
    const articles = await user.getFollowableArticles()
    return res.json(articles)
  }
  if (type === 'posts') {
    const posts = await user.getFollowablePosts()
    return res.json(posts)
  }
  if (type === 'recruitments') {
    const recruitments = await user.getFollowableRecruitments()
    return res.json(recruitments)
  }
  return res.status(400).json({ error: 'Invalid type' })
})



module.exports = router


