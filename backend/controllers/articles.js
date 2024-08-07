const Article = require('../models/article')

const router = require('express').Router()
const { userExtractor, authorize } = require('../utils/middleware')

router.get('/', async(req, res) => {
  // TODO: implement query params

  const articles = await Article.findAll({})
  res.json(articles)
})

router.post('/', userExtractor, authorize(['admin']), async(req, res) => {
  const article = await Article.create(req.body)
  res.status(201).json(article)
})

router.get('/:id', async(req, res) => {
  const article = await Article.findByPk(req.params.id)
  if (article) {
    res.json(article)
  } else {
    res.status(404).end()
  }
})

router.put('/:id', userExtractor, async(req, res) => {
  const article = await Article.findByPk(req.params.id)
  const { views, likes, title, content, type } = req.body
  if (views) article.views = views
  if (likes) article.likes = likes
  // TODO: implement authorization
  if (req.user.role !== 'admin') {
    if (title || content || type) {
      return res.status(403).json({ error: 'title, content or type can only be changed by admin' })
    }
  } else {
    if (title) article.title = title
    if (content) article.content = content
    if (type) article.type = type
  }

  if (article) {
    await article.update(req.body)
    res.json(article)
  } else {
    res.status(404).end()
  }
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