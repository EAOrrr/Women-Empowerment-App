// https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')

const { SECRET, WECHAT_APPID, WECHAT_SECRET } = require('../utils/config')
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
  }

  // TODO: add expiresIn
  const token = jwt.sign(userForToken, SECRET,)
  res
    .status(200)
    .send({ token, username: user.username, avatar: user.avatar })

})

router.post('/wechat', async (req, res) => {
  const { code } = req.body
  const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`)
  const { openid } = response.data
  const user = await User.findOne({
    where: {
      openid
    }
  })

  if (! user) {
    return res.status(401).json({
      error: 'invalid openid'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  res
    .status(200)
    .send({ token, username: user.username, avatar: user.avatar })
})

module.exports = router