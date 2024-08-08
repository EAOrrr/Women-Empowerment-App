const { User, Post, Comment } = require('../models')
const { Sequelize } = require('sequelize')

const router = require('express').Router()
const { userExtractor, authorize, checkFields } = require('../utils/middleware')

// TODO numberofComments and Query
router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    attributes: {
      exclude: ['userId'],
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('comments.id')), 'numberOfComments']
      ]
    },

    include: [
      {
        model: User,
        as: 'poster',
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: [],
      }
    ],
    group: ['Post.id', 'poster.id'] // 按照 Post 的 ID 分组
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
    include: [{
      model: User,
      as: 'poster',
      attributes: ['username']
    },
    {
      model: Comment,
      attributes: {
        exclude: ['commentableId', 'commentableType', 'userId']
      },
      include: {
        model: User,
        as: 'commenter',
        attributes: ['username']
      }
    }]
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
router.put('/:id',
  userExtractor,
  checkFields(['views', 'likes', 'status', 'follow']),
  async (req, res) => {
    const post = await Post.findByPk(req.params.id)
    const updatedPost = post.toJSON()
    if (!post) {
      return res.status(404).end()
    }
    const { views, likes, status, title, content, follow } = req.body

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
router.post('/:id/comments', userExtractor, authorize(['user', 'admin']), async (req, res) => {
  const post = await Post.findByPk(req.params.id)

  if (!post) {
    return res.status(404).end()
  }
  if (req.user.role !== 'admin' && post.userId !== req.user.id) {
    return res.status(403).json({ error: 'No Permission' })
  }
  // const comment = await Comment.create({
  //   ...req.body,
  //   commentableType: 'post',
  //   commentableId: post.id,
  //   commenterId: req.user.id
  // })
  const comment = await post.createComment({
    ...req.body,
    commentableType: 'post',
    commentableId: post.id,
    userId: req.user.id
  })
  const commentToReturn = {
    id: comment.id,
    content: comment.content,
    likes: comment.likes,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    commenter: {
      username: req.user.username,
      userId: req.user.id,
    },
    commentedPost: {
      postId: post.id,
    }
  }
  res.status(201).json(commentToReturn)
})

// TODO PUT /api/posts/:id/comments
router.put('/:id/comments/:commentId', checkFields(['likes']), async (req, res) => {
  const { likes } = req.body
  console.log('herre')
  const post = await Post.findByPk(req.params.id)

  if (!post) {
    return res.status(404).end()
  }
  console.log('check post fininish')
  const comment = await Comment.findByPk(req.params.commentId)
  if (!comment) {
    return res.status(404).end()
  }
  if (comment.commentableId !== post.id) {
    return res.status(400).json({ error: 'The comment does not belong to the specified post' })
  }
  await comment.update({ likes })
  const user = await comment.getCommenter()
  const commentToReturn = {
    id: comment.id,
    content: comment.content,
    likes: comment.likes,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    commenter: {
      username: user.username,
      userId: user.id,
    },
    commentedPost: {
      postId: post.id,
    }
  }
  console.log(commentToReturn)
  res.json(commentToReturn)
})

module.exports = router

