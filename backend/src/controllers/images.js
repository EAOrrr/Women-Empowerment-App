const { Image } = require('../models')

const router = require('express').Router()
const { userExtractor, authorize } = require('../utils/middleware')
const multer = require('multer')

const path = require('path')
const express = require('express')
const { decodeToken } = require('../utils/helper')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: function(req, file, cb) {
    checkFileType(req, file, cb)
  }
})

function checkFileType(req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    return cb(null, false)
  }
}

router.post('/',
  userExtractor,
  authorize(['admin']),
  upload.single('image'),
  async(req, res) => {
    console.log('uploading image')
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' })
    }
    // console.log(file)
    const image = await Image.create({
      data: file.buffer,
      mimeType: file.mimetype,
    })
    res.status(201).json({
      message: 'Image uploaded successfully',
      imageId: image.id,
      imageUrl: `/api/images/${image.id}` })
    // res.status(201).end()
  })

router.get('/:id', async(req, res) => {
  const image = await Image.findByPk(req.params.id)
  if (!image) {
    return res.status(404).end()
  }
  // console.log(image.mimeType)
  res.set('Content-Type', image.mimeType)
  res.send(image.data)
})

router.delete('/:id', userExtractor, authorize(['admin']), async(req, res) => {
  const image = await Image.findByPk(req.params.id)
  if (!image) {
    return res.status(404).end()
  }
  await image.destroy()
  res.status(204).end()
})


router.post('/deletebatch', userExtractor, authorize(['admin']), async(req, res) => {
  const { imageIds } = req.body
  await Image.destroy({
    where: {
      id: imageIds
    }
  })
  res.status(204).end()
})

router.post('/beacondelete', express.text(), async(req, res) => {
  const { imageIds, token } = JSON.parse(req.body)
  console.log(req.body)
  const decodeResult = await decodeToken(token)
  if (decodeResult.status !== 200) {
    console.log('error')
    console.log(decodeResult)
    return res.status(401).json({ error: decodeResult.error })
  }
  if (decodeResult.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' })
  }
  console.log('deleting images')
  console.log(req.body)
  await Image.destroy({
    where: {
      id: imageIds
    }
  })
})

router.post('/image-references', userExtractor, authorize(['admin']), async(req, _res) => {
  const { imageIds, referenceType, referenceId } = req.body
  await Image.update({
    referenceType,
    referenceId
  }, {
    where: {
      id: imageIds
    }
  })
})


module.exports = router