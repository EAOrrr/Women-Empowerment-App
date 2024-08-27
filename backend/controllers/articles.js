const { Op } = require('sequelize')
const { Article, Follow } = require('../models')

const nodejieba = require('nodejieba')
const router = require('express').Router()
const { userExtractor, authorize } = require('../utils/middleware')
const { buildOrderClause, buildPaginationCondition, generateCursor } = require('../utils/helper')

// TODO: 根据相关度排序
// GET /api/articles
router.get('/', async (req, res) => {
  const { type, keyword, limit, ordering, tags, cursor, offset, total } = req.query
  const keywords = keyword
    ? [...new Set(nodejieba.cut(keyword, true))]
    : null

  if (offset && cursor) {
    return res.status(400).json({ error: 'Cannot use both cursor and offset' })
  }
  console.log(offset, cursor, limit)

  const where = buildWhereClause({ type, keywords, tags, cursor, ordering, offset })
  const order = buildOrderClause(ordering, 'createdAt', ['createdAt', 'likes', 'views'])

  if (!order) {
    return res.status(400).json({ error: 'Invalid ordering field' })
  }

  const articles = await Article.findAll({
    attributes: { exclude: ['content'] },
    where,
    order,
    limit: (limit && parseInt(limit)),
    offset: (!cursor && offset) || 0
  })

  let count
  if (total) {
    count = await Article.count({ where })
  }

  if (articles.length > 0 && !offset) {
    const cursor = generateCursor(articles[articles.length - 1], ordering)
    res.json({ articles, cursor, count })
  } else {
    res.json({ articles, count })
  }
})

function buildWhereClause({ type, keywords, tags, cursor }) {
  const where = {}

  if (type) where.type = type
  if (keywords) {
    // const keywords = nodejieba.cut(keyword, true)
    console.log(keywords)
    const keywordConditions = keywords.map(k => ({
      [Op.or]: [
        { title: { [Op.iLike]: `%${k}%` } },
        { content: { [Op.iLike]: `%${k}%` } },
      ]
    }))

    // where[Op.and] = [{
    //   [Op.or]: [
    //     { title: { [Op.iLike]: `%${keyword}%` } },
    //     { content: { [Op.iLike]: `%${keyword}%` } },
    //   ]
    // }]
    where[Op.and] = [{ [Op.or]: keywordConditions }]
  }

  if (tags) {
    const tagArray = tags.split(',')
    where.tags = { [Op.contains]: tagArray }
  }


  if (cursor) {
    const paginationCondition = buildPaginationCondition(cursor)
    if (paginationCondition) {
      if (where[Op.and]) {
        where[Op.and].push(paginationCondition)
      } else {
        where[Op.and] = [paginationCondition]
      }
    }
  }
  return where
}

// POST /api/articles
router.post('/', userExtractor, authorize(['admin']), async(req, res) => {

  const abstract = req.body.content && req.body.content.substring(0, 50)
  const article = await Article.create({ ...req.body, abstract })
  res.status(201).json(article)
})

// GET /api/articles/:id
router.get('/:id', async(req, res) => {
  const article = await Article.findByPk(req.params.id, {
    attributes: { exclude: ['abstract'] }
  })
  if (article) {
    res.json(article)
  } else {
    res.status(404).end()
  }
})

// PUT /api/articles/:id
router.put('/:id',
  userExtractor,
  async(req, res) => {
    const article = await Article.findByPk(req.params.id)
    if (!article) {
      return res.status(404).end()
    }
    const { views, likes, title, content, type, follow, isAnnouncement } = req.body
    if (!req.user || req.user.role !== 'admin') {
      if (title || content || type || isAnnouncement) {
        return res.status(403).json({ error: 'title, content or type can only be changed by admin' })
      }
    } else {
      if (title) article.title = title
      if (content) article.content = content
      if (type) article.type = type
      if (isAnnouncement) article.isAnnouncement = isAnnouncement
    }
    if (views) article.views = views
    if (likes) article.likes = likes

    await article.update(req.body)
    res.json(article)
  })

// DELETE /api/articles/:id
router.delete('/:id', userExtractor, authorize(['admin']), async(req, res) => {
  const article = await Article.findByPk(req.params.id)
  if (article) {
    await article.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

// TODO: 收藏功能
// POST /api/articles/:id/follow
router.post('/:id/follow', userExtractor, async(req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const article = await Article.findByPk(req.params.id)
  if (!article) {
    return res.status(404).end()
  }
  const follow = await Follow.findOne({
    where: {
      followerId: req.user.id,
      followableId: article.id,
      followableType: 'article'
    }
  })
  if (follow) {
    return res.status(409).json({ error: 'Already followed' })
  }

  await Follow.create({
    followerId: req.user.id,
    followableId: article.id,
    followableType: 'article'
  })
  res.status(201).end()
})

// DELETE /api/articles/:id/follow
router.delete('/:id/follow', userExtractor, async(req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const article = await Article.findByPk(req.params.id)
  if (!article) {
    return res.status(404).end()
  }
  const follow = await Follow.findOne({
    where: {
      followerId: req.user.id,
      followableId: article.id,
      followableType: 'article'
    }
  })
  if (!follow) {
    return res.status(404).end()
  }
  await follow.destroy()
  res.status(204).end()
})

module.exports = router