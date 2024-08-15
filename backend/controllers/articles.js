const { Op } = require('sequelize')
const { Article } = require('../models')

const router = require('express').Router()
const { userExtractor, authorize } = require('../utils/middleware')
const { buildOrderClause, buildPaginationCondition, generateCursor } = require('../utils/helper')

// TODO: implement query params
router.get('/', async (req, res) => {
  const { type, keyword, limit, ordering, tags, cursor, offset } = req.query
  if (offset && cursor) {
    return res.status(400).json({ error: 'Cannot use both cursor and offset' })
  }

  const where = buildWhereClause({ type, keyword, tags, cursor, ordering, offset })
  const order = buildOrderClause(ordering, 'createdAt', ['createdAt', 'likes', 'views'])

  if (!order) {
    return res.status(400).json({ error: 'Invalid ordering field' })
  }

  const articles = await Article.findAll({
    attributes: { exclude: ['content'] },
    where,
    order,
    limit: limit || 10,
    offset: (!cursor && offset) || 0
  })

  if (articles.length > 0) {
    const cursor = generateCursor(articles[articles.length - 1], ordering)
    res.json({ articles, cursor })
  } else {
    res.json({ articles })
  }
})

function buildWhereClause({ type, keyword, tags, cursor }) {
  const where = {}

  if (type) where.type = type
  if (keyword) {
    where[Op.and] = [{
      [Op.or]: [
        { title: { [Op.iLike]: `%${keyword}%` } },
        { content: { [Op.iLike]: `%${keyword}%` } },
      ]
    }]
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




router.post('/', userExtractor, authorize(['admin']), async(req, res) => {

  const abstract = req.body.content && req.body.content.substring(0, 50)
  const article = await Article.create({ ...req.body, abstract })
  res.status(201).json(article)
})

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

router.put('/:id', userExtractor, async(req, res) => {
  const article = await Article.findByPk(req.params.id)
  if (!article) {
    return res.status(404).end()
  }
  const { views, likes, title, content, type, follow } = req.body
  if (!req.user || req.user.role !== 'admin') {
    if (title || content || type) {
      return res.status(403).json({ error: 'title, content or type can only be changed by admin' })
    }
  } else {
    if (title) article.title = title
    if (content) article.content = content
    if (type) article.type = type
  }
  if (views) article.views = views
  if (likes) article.likes = likes

  // TODO: FOLLOW function
  if (follow) {
    // follow
  }

  await article.update(req.body)
  res.json(article)
})

router.delete('/:id', userExtractor, authorize(['admin']), async(req, res) => {
  const article = await Article.findByPk(req.params.id)
  if (article) {
    await article.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router