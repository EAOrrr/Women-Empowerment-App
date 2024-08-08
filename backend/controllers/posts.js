const { User, Post } = require('../models')

const router = require('express').Router()
const { userExtractor, authorize } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    include: {
      model: User,
      attributes: ['username']
    }
  })
  res.json(posts)
})

router.post('/',
  userExtractor,
  authorize(['admin', 'user']),
  async (req, res) => {

    const post = await Post.create({
      ...req.body,
      userId: req.user.id
    })
    res.status(201).json(post)
})

module.exports = router

