const { User, Post, Comment, Notification, Follow } = require('../models')
const { Sequelize, Op } = require('sequelize')

const router = require('express').Router()
const { userExtractor, authorize, checkFields } = require('../utils/middleware')
const { buildOrderClause, generateCursor, buildPaginationCondition, hyphensToSpaces } = require('../utils/helper')

// TODO Query
router.get('/', async (req, res) => {
  const { keyword, status, limit, ordering, cursor, offset, total } = req.query
  if (offset && cursor) {
    return res.status(400).json({ error: 'Cannot use both cursor and offset' })
  }
  const where = buildWhereClause({ status, keyword, cursor })
  const order = buildOrderClause(ordering, 'createdAt', ['createdAt', 'likes', 'views', 'updatedAt'])

  if (!order) {
    return res.status(400).json({ error: 'Invalid ordering field' })
  }

  const posts = await Post.findAll({
    attributes: {
      include: [
        [Sequelize.literal('(SELECT COUNT(*) from comments as c WHERE c.commentable_id = "Post"."id" AND c.commentable_type = \'post\')'), 'numberOfComments']
      ],
      exclude: ['userId'],
    },

    include: [
      {
        model: User,
        as: 'poster',
        attributes: ['username']
      },
    ],
    where,
    order,
    limit: limit || 10,
    offset: (!cursor && offset) || 0
  })

  let count
  if (total) {
    count = await Post.count({ where })
  }

  if (posts.length > 0) {
    const cursor = generateCursor(posts[posts.length - 1].id, ordering)
    return res.json({ posts, cursor, count })
  }
  res.json({ posts, count })
  // res.json(posts)
})

function buildWhereClause({ status, keyword, cursor }) {
  const where = {}

  if (status) {
    where.status = hyphensToSpaces(status)
  }

  if (keyword) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${keyword}%` } },
      { content: { [Op.iLike]: `%${keyword}%` } },
    ]
  }

  if (cursor) {
    const paginationCondition = buildPaginationCondition(cursor)
    if (paginationCondition) {
      where[Op.and] = paginationCondition
    }
  }
  return where
}

router.post('/',
  userExtractor,
  authorize(['admin', 'user']),
  async (req, res) => {

    const post = await Post.create({
      ...req.body,
      userId: req.user.id
    })

    // 发送信息给所有管理员
    const admins = await User.findAll({
      where: {
        role: 'admin'
      }
    })

    await Promise.all(admins.map(admin =>
      Notification.create({
        message: `用户 ${req.user.username} 发表了新帖子 ${post.title}`,
        userId: admin.id,
        jumpTo: `/posts/${post.id}`,
        type: 'post_created'
      })
    ))
    res.status(201).json(post)
  })

router.get('/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    attributes: {
      exclude: ['userId'],
    },
    include: {
      model: User,
      as: 'poster',
      attributes: ['username']
    },

  })
  if (!post) {
    return res.status(404).end()
  }
  let comments = undefined
  if (req.query.comments) {
    comments = await post.getComments({
      attributes: {
        exclude: ['commentableId', 'commentableType', 'userId']
      },
      include: {
        model: User,
        as: 'commenter',
        attributes: ['username'],
        order: [['createdAt', 'DESC']]
      }
    })
  }
  res.json({ ...post.toJSON(), comments })
})

router.get('/:id/comments', async (req, res) => {
  const post = await Post.findByPk(req.params.id)
  if (!post) {
    return res.status(404).end()
  }
  const comments = await post.getComments({
    attributes: {
      exclude: ['commentableId', 'commentableType', 'userId']
    },
    order: [['createdAt', 'ASC']],
    include: {
      model: User,
      as: 'commenter',
      attributes: ['username']
    }
  })

  res.json(comments)
})

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

router.put('/:id',
  userExtractor,
  checkFields(['views', 'likes', 'status', 'follow']),
  async (req, res) => {
    const post = await Post.findByPk(req.params.id)
    const updatedPost = post.toJSON()
    if (!post) {
      return res.status(404).end()
    }
    const { views, likes, status } = req.body

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

router.post('/:id/comments', userExtractor, authorize(['user', 'admin']), async (req, res) => {
  const post = await Post.findByPk(req.params.id)

  if (!post) {
    return res.status(404).end()
  }
  if (req.user.role !== 'admin' && post.userId !== req.user.id) {
    return res.status(403).json({ error: 'No Permission' })
  }

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
  if (req.user.id === post.userId) {
    // 发帖者回复信息，给所有管理员发送信息
    const admins = await User.findAll({
      where: {
        role: 'admin'
      }
    })
    await Promise.all(admins.map(admin =>
      Notification.create({
        message: `用户 ${req.user.username} 在 ${post.title} 留言下发表了新的回复\
        ${comment.content.substring(0, 50)}，请查看`,
        userId: admin.id,
        jumpTo: `/posts/${post.id}/comments/${comment.id}`,
        type: 'comment_reply'
      })
      // post状态设为in progress
    ))
    await post.update({ status: 'in progress' })
  } else {
    // 管理员回复信息，给发帖者发送信息
    await Notification.create({
      message: `管理员回应了您的留言 ${post.title}，请查看`,
      userId: post.userId,
      jumpTo: `/posts/${post.id}/comments/${comment.id}`,
      type: 'comment_reply'
    })
    // 将该帖子状态 status 设置为 answered
    await post.update({ status: 'answered' })
  }
  res.status(201).json(commentToReturn)
})

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

router.post('/:id/follow', userExtractor, authorize(['user', 'admin']), async (req, res) => {
  const post = await Post.findByPk(req.params.id)
  if (!post) {
    return res.status(404).end()
  }
  // await post.addFollower(req.user)
  const follow = await Follow.findOne({
    where: {
      followableId: post.id,
      followableType: 'post',
      followerId: req.user.id
    }
  })
  if (follow) {
    return res.status(409).json({ error: 'Already followed' })
  }
  await Follow.create({
    followableId: post.id,
    followableType: 'post',
    followerId: req.user.id
  })
  res.status(201).end()
})

router.delete('/:id/follow', userExtractor, authorize(['user', 'admin']), async (req, res) => {
  const post = await Post.findByPk(req.params.id)
  if (!post) {
    return res.status(404).end()
  }
  await post.removeFollower(req.user)
  res.status(204).end()
})

module.exports = router

