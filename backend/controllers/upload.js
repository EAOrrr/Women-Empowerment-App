const { Image, Draft } = require('../models')

const router = require('express').Router()
const { userExtractor, authorize } = require('../utils/middleware')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/images',
  userExtractor,
  authorize(['admin']),
  upload.single('image'),
  async(req, res) => {

    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    // console.log(file)
    const image = await Image.create({
      data: file.buffer,
      mimeType: file.mimetype
    })
    res.status(201).json({ 
      message: 'Image uploaded successfully', 
      imageId: image.id, 
      imageUrl: `/api/upload/images/${image.id}` })
    // res.status(201).end()
  })

router.get('/images/:id', async(req, res) => {
  const image = await Image.findByPk(req.params.id)
  if (!image) {
    return res.status(404).end()
  }
  res.set('Content-Type', image.mimeType)
  res.send(image.data)
})

router.delete('/images/:id', userExtractor, authorize(['admin']), async(req, res) => {
  const image = await Image.findByPk(req.params.id)
  if (!image) {
    return res.status(404).end()
  }
  await image.destroy()
  res.status(204).end()
})

router.get('/draft',
  userExtractor,
  authorize(['admin']),
  async(req, res) => {
    const draft = await Draft.findOne({
      where: {
        userId: req.user.id
      }
    })
    if (!draft) {
      return res.status(404).end()
    }
    // res.json(draft)
    res.json({
      ...draft.toJSON(),
      userId: undefined
    })
})

router.post('/draft',
  userExtractor,
  authorize(['admin']),
  async(req, res) => {
    let draft = await Draft.findOne({
      where: {
        userId: req.user.id
      }
    })
    if (draft) {
      draft.content = req.body.content
      await draft.save()
      return res.json({
        ...draft.toJSON(),
        userId: undefined
      })
    } else {
      draft = await Draft.create({
        content: req.body.content,
        userId: req.user.id
      })
      return res.status(201).json({
        ...draft.toJSON(),
        userId: undefined
      })
    }
  })

router.delete('/draft',
  userExtractor,
  authorize(['admin']),
  async(req, res) => {
    await Draft.destroy({
      where: {
        userId: req.user.id
      }
    })
    res.status(204).end()
  })
module.exports = router
