const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const { Image, User } = require('../models')
const { connectToDatabase, sequelize } = require('../utils/db')

beforeEach(async () => {
  await connectToDatabase()
  await Image.destroy({ where: {} })
  await User.destroy({ where: {} })
})

describe.only('UPLOAD API', () => {
  let adminToken
  let adminUserId
  beforeEach(async () => {
    const adminUser = {
      username: 'admin',
      password: 'adminpassword',
      role: 'admin'
    }
    const user = await helper.createUser(api, adminUser)
    adminUserId = user.userId
    adminToken = await helper.getToken(api, adminUser)
  })

  describe.only('UPLOAD IMAGES API', () => {
    test('upload image with valid token', async () => {
      const imagesAtStart = await helper.imagesInDb()
      const res = await api
        .post('/api/upload/images')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'image/jpeg')
        .attach('image', 'tests/assets/test.jpg')
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const imagesAtEnd = await helper.imagesInDb()
      assert.strictEqual(res.body.message, 'Image uploaded successfully')
      assert.strictEqual(imagesAtEnd.length, imagesAtStart.length + 1)
    })

    test.only('invalid type cannot be uploaded', async () => {
      const imagesAtStart = await helper.imagesInDb()
      const response = await api
        .post('/api/upload/images')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'image/jpeg')
        .attach('image', 'tests/assets/test.txt')
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.error, 'No file uploaded or invalid file type')
      const imagesAtEnd = await helper.imagesInDb()
      assert.strictEqual(imagesAtEnd.length, imagesAtStart.length)
    })

  })

  describe('DOWNLOAD IMAGES API', () => {
    test('download image with valid id', async () => {
      const image = await Image.create({
        data: Buffer.from('test image'),
        mimeType: 'image/jpeg'
      })
      const res = await api
        .get(`/api/upload/images/${image.id}`)
        .expect(200)
        .expect('Content-Type', /image\/jpeg/)
      assert.strictEqual(res.body.toString(), 'test image')
    })
  })

  describe('DELETE IMAGES API', () => {
    test('delete image with valid id', async () => {
      const image = await Image.create({
        data: Buffer.from('test image'),
        mimeType: 'image/jpeg'
      })
      const imagesAtStart = await helper.imagesInDb()
      await api
        .delete(`/api/upload/images/${image.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)
      const imagesAtEnd = await helper.imagesInDb()
      assert.strictEqual(imagesAtEnd.length, imagesAtStart.length - 1)
    })
  })


})

after(async () => {
  await sequelize.close()
})