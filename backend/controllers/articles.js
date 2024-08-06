const Article = require('../models/article')

const router = require('express').Router()


router.get('/', async(req, res, next) => {
  const where = {}

  const articles = await Article.findAll({})
  res.json(articles)
})

router.post('/', async(req, res, next) => {
  const article = await Article.create(req.body)
  res.status(201).json(article)
})

router.get('/:id', async(req, res, next) => {
  const article = await Article.findByPk(req.params.id)
  if (article) {
    res.json(article)
  } else {
    res.status(404).end()
  }
})

router.put('/:id', async(req, res, next) => {
  const article = await Article.findByPk(req.params.id)
  const { views, likes, title, content, type } = req.body
  if (typeof views === 'number') article.views = views
  if (typeof likes === 'number') article.likes = likes
  // TODO: implement authorization
  if (article) {
    await article.update(req.body)
    res.json(article)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async(req, res, next) => {
  const article = await Article.findByPk(req.params.id)
  if (article) {
    await article.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router