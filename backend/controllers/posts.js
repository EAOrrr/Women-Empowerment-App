const { User, Post } = require('../models')

const router = require('express').Router()
const { userExtractor, authorize } = require('../utils/middleware')

// TODO numberofComments and Query
router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    attributes: {
      exclude: ['userId'],
    },
    include: {
      model: User,
      as: 'poster',
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

// TODO GET /api/posts/:id
router.get('/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    attributes: {
      exclude: ['userId'],
    },
    include: {
      model: User,
      as: 'poster',
      attributes: ['username']
    }
  })
  if (post) {
    res.json(post)
  } else {
    res.status(404).end()
  }
})

// TODO DELETE /api/posts/:id
router.delete('/:id', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const post = await Post.findByPk(req.params.id)
  if (!post) {
    return res.status(404).end()
  }
  if (req.user.role !== 'admin' && req.user.id !== post.userId) {
    return res.status(403).json({ error: 'The data is modified without permission' })
  }
  await post.destroy()
  res.status(204).end()
})

// TODO PUT /api/posts/:id
router.put('/:id', userExtractor, async (req, res) => {
  const post = await Post.findByPk(req.params.id)
  const updatedPost = post.toJSON()
  if (!post) {
    return res.status(404).end()
  }
  const { views, likes, status, title, content, follow } = req.body
  // 对于标题title和内容content以及日期类字条，任何用户不可修改
  if (title || content) {
    return res.status(403).json({ error: 'The data is modified without permission' })
  }
  // 对于帖子的状态status,只有可以发帖者可以修改
  if (status) {
    if (req.user.id !== post.userId) {
      return res.status(403).json({ error: 'The data is modified without permission' })
    }
    updatedPost.status = status
  }
  // 对于浏览数views和关注数likes，任何登录的用户都可以修改
  if (views) updatedPost.views = views
  if (likes) updatedPost.likes = likes

  // TODO follow function
  await post.update(updatedPost)
  res.json(post)
})

// TODO POST /api/posts/:id/comments

// TODO PUT /api/posts/:id/comments

module.exports = router

