const { Sequelize, Op } = require('sequelize')
const { Recruitment, Job, Follow, Image } = require('../models')
const router = require('express').Router()
const { userExtractor, authorize, checkFields } = require('../utils/middleware')
const { buildOrderClause, generateCursor, buildPaginationCondition } = require('../utils/helper')
const nodejieba = require('nodejieba')

// TODO: recruitments controller 路由控制器
// GET /api/recruitments
router.get('/', async (req, res) => {
  const { keyword, limit, offset, ordering, cursor } = req.query
  const keywords = keyword
    ? [...new Set(nodejieba.cut(keyword, true))]
    : null

  if (offset && cursor) {
    return res.status(400).json({ error: 'Cannot use both cursor and offset' })
  }

  const where = buildWhereClause({ keywords, cursor })
  const order = buildOrderClause(ordering, 'createdAt', ['createdAt', 'updatedAt', 'likes', 'views'])
  const recruitments = await Recruitment.findAll({
    attributes: {
      include: [
        [Sequelize.literal('(SELECT COUNT(*) from comments as c WHERE c.commentable_id = recruitment.id AND c.commentable_type = \'recruitment\')'), 'numberOfComments']
      ]
    },
    order,
    limit: (limit && parseInt(limit)),
    offset: (!cursor && offset) || 0,
    include: [{
      model: Job,
      attributes: ['name']
    }],
    where
  })

  const count = await Recruitment.count({ where })

  if (recruitments.length > 0 && !offset) {
    const cursor = generateCursor(recruitments[recruitments.length - 1], ordering)
    res.json({ recruitments, cursor, count })
  } else {
    res.json({ recruitments, count })
  }

  // res.json(recruitments)
})

function buildWhereClause({ keywords, cursor }) {
  const where = {}
  if (keywords) {
    console.log(keywords)
    const keywordConditions = keywords.map(k => ({
      [Op.or]: [
        { title: { [Op.iLike]: `%${k}%` } },
        { intro: { [Op.iLike]: `%${k}%` } },
        { province: { [Op.iLike]: `%${k}%` } },
        { city: { [Op.iLike]: `%${k}%` } },
        { district: { [Op.iLike]: `%${k}%` } },
        { street: { [Op.iLike]: `%${k}%` } },
        { address: { [Op.iLike]: `%${k}%` } },
        { name: { [Op.iLike]: `%${k}%` } },
        { phone: { [Op.iLike]: `%${k}%` } },
      ]
    }))
    where[Op.and] = keywordConditions
  }

  if (cursor) {
    const cursorCondition = buildPaginationCondition(cursor)
    if (cursorCondition) {
      where[Op.and] = where[Op.and] ? [...where[Op.and], cursorCondition] : [cursorCondition]
    }
  }

  return where
}

// POST /api/recruitments
router.post('/', userExtractor, authorize('admin'), async (req, res) => {
  const body = req.body
  const pictures = body.pictures
  const recruitment = await Recruitment.create(body)
  await recruitment.setImages(pictures)
  res.status(201).json(recruitment)
})

// GET /api/recruitments/:id
router.get('/:id', async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id, {
    include: [{
      model: Job,
      attributes: {
        exclude: ['recruitmentId']
      }
    }],
  })
  if (!recruitment) {
    return res.status(404).end()
  }
  res.json(recruitment)
})

// PUT /api/recruitments/:id
router.put('/:id', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const { title, intro, province, city, district, street, address, views, likes, name, phone, pictures } = req.body
  if (title || intro || province || city || district || street || address || name || phone || pictures) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'title, intro, province, city, district, street or address can only be changed by admin' })
    }
    if (title) recruitment.title = title
    if (intro) recruitment.intro = intro
    if (province) recruitment.province = province
    if (city) recruitment.city = city
    if (district) recruitment.district = district
    if (street) recruitment.street = street
    if (address) recruitment.address = address
    if (name) recruitment.name = name
    if (phone) recruitment.phone = phone
    if (pictures) {
      // await recruitment.setImages(pictures)
      recruitment.pictures = pictures
      await Image.update(
        { referenceType: 'recruitment',
          referenceId: recruitment.id
        },
        { where: { id: pictures } }

      )
    }
  }
  if (views) recruitment.views = views
  if (likes) recruitment.likes = likes
  await recruitment.save()

  // const body = req.body
  res.json(recruitment)
})

// DELETE /api/recruitments/:id
router.delete('/:id', userExtractor, authorize(['admin']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  await recruitment.destroy()
  res.status(204).end()
})

// POST /api/recruitments/:id/comments
router.post('/:id/comments', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  console.log(req.body)
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const comment = await recruitment.createComment({
    ...req.body,
    commentableType: 'recruitment',
    commentableId: recruitment.id,
    userId: req.user.id
  })
  res.status(201).json(comment)
})

// GET /api/recruitments/:id/comments
router.get('/:id/comments', async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const comments = await recruitment.getComments()
  res.json(comments)
})

// DELETE /api/recruitments/:id/comments/:commentId
router.delete('/:id/comments/:commentId', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const comment = await recruitment.getComments({ where: { id: req.params.commentId } })
  if (!comment) {
    return res.status(404).end()
  }
  if (req.user.role !== 'admin' && req.user.id !== comment[0].userId) {
    return res.status(403).json({ error: 'The data is modified without permission' })
  }
  await comment[0].destroy()
  res.status(204).end()
})

// PUT /api/recruitments/:id/comments/:commentId
router.put('/:id/comments/:commentId',
  userExtractor,
  authorize(['admin', 'user']),
  checkFields(['id', 'likes']),
  async (req, res) => {

    const recruitment = await Recruitment.findByPk(req.params.id)
    if (!recruitment) {
      return res.status(404).end()
    }
    const comment = await recruitment.getComments({ where: { id: req.params.commentId } })
    if (!comment) {
      return res.status(404).end()
    }
    await comment[0].update(req.body)
    res.json(comment[0])
  })

// POST /api/recruitments/:id/jobs
router.post('/:id/jobs', userExtractor, authorize(['admin']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const job = await recruitment.createJob(req.body)
  res.status(201).json(job)
})

// GET /api/recruitments/:id/jobs
router.get('/:id/jobs', async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const jobs = await recruitment.getJobs()
  res.json(jobs)
})

// DELETE /api/recruitments/:id/jobs/:jobId
router.delete('/:id/jobs/:jobId', userExtractor, authorize(['admin']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const job = await recruitment.getJobs({ where: { id: req.params.jobId } })
  if (!job) {
    return res.status(404).end()
  }
  await job[0].destroy()
  res.status(204).end()
})

// PUT /api/recruitments/:id/jobs/:jobId
router.put('/:id/jobs/:jobId', userExtractor, authorize(['admin']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const job = await recruitment.getJobs({ where: { id: req.params.jobId } })
  if (!job) {
    return res.status(404).end()
  }
  await job[0].update(req.body)
  res.json(job[0])
})

// POST /api/recruitments/:id/follow
router.post('/:id/follow', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const follow = await Follow.findOne({
    where: {
      followableId: recruitment.id,
      followableType: 'recruitment',
      followerId: req.user.id
    }
  })
  if (follow) {
    return res.status(409).json({ error: 'You have already followed' })
  }
  await Follow.create({
    followableId: recruitment.id,
    followableType: 'recruitment',
    followerId: req.user.id
  })
  res.status(201).end()
})

// DELETE /api/recruitments/:id/follow
router.delete('/:id/follow', userExtractor, authorize(['admin', 'user']), async (req, res) => {
  const recruitment = await Recruitment.findByPk(req.params.id)
  if (!recruitment) {
    return res.status(404).end()
  }
  const follow = await Follow.findOne({
    where: {
      followableId: recruitment.id,
      followableType: 'recruitment',
      followerId: req.user.id
    }
  })
  if (!follow) {
    return res.status(404).end()
  }
  await follow.destroy()
  res.status(204).end()
})

module.exports = router