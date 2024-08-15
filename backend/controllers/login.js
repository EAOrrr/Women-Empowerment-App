// https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')
const helper = require('../utils/helper')
const { v4: uuidv4 } = require('uuid');  // 使用 UUID 生成唯一的 jti

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, WECHAT_APPID, WECHAT_SECRET } = require('../utils/config')
const { User } = require('../models')

router.post('/pwd', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.password)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4()
  }

  // TODO: add expiresIn
  // const token = jwt.sign(userForToken, ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  // const refreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
  const token = jwt.sign(userForToken, ACCESS_TOKEN_SECRET, 
    { expiresIn: helper.generateExpiration(60 * 60) }
  )
  const refreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET,
    { expiresIn: helper.generateExpiration(60 * 60 * 24 * 7) }
  )
  res
    .status(200)
    .send({ token, refreshToken, username: user.username, avatar: user.avatar })

})

router.post('/wechat', async (req, res) => {
  const { code } = req.body
  const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`)
  const { errcode, openid } = response.data
  if (errcode) {
    return res.status(502).json({
      error: 'something went wrong when trying to get openid'
    })
  }
  const user = await User.findOne({
    where: {
      openid
    }
  })

  if (! user) {
    return res.status(401).json({
      error: 'user does not exist'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4()
  }

  // const token = jwt.sign(userForToken, ACCESS_TOKEN_SECRET)
  // const refreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET)
  const token = jwt.sign(userForToken, ACCESS_TOKEN_SECRET,
    { expiresIn: helper.generateExpiration(60 * 60) }
  )
  const refreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET,
    { expiresIn: helper.generateExpiration(60 * 60 * 24 * 7) }
  )

  res
    .status(200)
    .send({ token, refreshToken, username: user.username, avatar: user.avatar })
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token invalid'
    })
  }
  const user = await User.findByPk(decodedToken.id)
  if (!user) {
    return res.status(401).json({
      error: 'user not found'
    })
  }
  const userForToken = {
    username: user.username,
    id: user.id,
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4()
  }
  // const token = jwt.sign(userForToken, ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  // const newRefreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET)
  const token = jwt.sign(userForToken, ACCESS_TOKEN_SECRET,
    { expiresIn: helper.generateExpiration(60 * 60) }
  )
  const newRefreshToken = jwt.sign(userForToken, REFRESH_TOKEN_SECRET,
    { expiresIn: helper.generateExpiration(60 * 60 * 24 * 7) }
  )
  res
    .status(200)
    .send({ token, refreshToken: newRefreshToken, username: user.username, avatar: user.avatar })
})

module.exports = router