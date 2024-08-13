const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const { Image, User, Draft } = require('../models')
const { connectToDatabase, sequelize } = require('../utils/db')

beforeEach(async () => {
  await connectToDatabase()
  await Image.destroy({ where: {} })
  await User.destroy({ where: {} })
  await Draft.destroy({ where: {} })
})

describe('UPLOAD API', () => {
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

  describe('UPLOAD IMAGES API', () => {
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

  describe('UPLOAD DRAFT API', () => {
    const draft = {
      'type': 'doc',
      'content': [
        {
          'type': 'paragraph',
          'content': [
            {
              'type': 'text',
              'text': 'Helloworld'
            }
          ]
        }
      ]
    }
    test('upload draft with valid token', async () => {
      const draftsAtStart = await helper.draftsInDb()

      const res = await api
        .post('/api/upload/draft')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ content: draft })
        .expect(201)
        .expect('Content-Type', /application\/json/)
      // assert.strictEqual(res.body, draft)
      // console.log(res.body)
      assert.deepStrictEqual(res.body.content, draft)
      assert(res.body.id)
      assert(res.body.createdAt)
      assert(res.body.updatedAt)
      assert(!res.body.userId)
      const draftsAtEnd = await helper.draftsInDb()
      assert.strictEqual(draftsAtEnd.length, draftsAtStart.length + 1)
      assert(draftsAtEnd.find(d => d.userId === adminUserId))
    })

    test('a user cannot upload more than one draft', async () => {
      const newDraft = {
        'type': 'anotherDoc',
        'content': draft.content
      }
      const draftsAtStart = await helper.draftsInDb()
      await api
        .post('/api/upload/draft')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ content: draft })
        .expect(201)
        .expect('Content-Type', /application\/json/)
      await api
        .post('/api/upload/draft')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ content: newDraft })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const draftsAtEnd = await helper.draftsInDb()
      assert.strictEqual(draftsAtEnd.length, draftsAtStart.length + 1)
      const adminDraft = draftsAtEnd.find(d => d.userId === adminUserId)
      console.log(draftsAtEnd, adminUserId)
      assert.deepStrictEqual(adminDraft.content, newDraft)

    })
    
    test('get draft with valid token', async () => {
      await api
        .post('/api/upload/draft')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ content: draft })
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/upload/draft')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      // console.log(response.body)
      // console.log(response.body)
      assert.deepStrictEqual(response.body.content, draft)
    })
      
    test('delete draft with valid token', async () => {
      await api
        .post('/api/upload/draft')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ content: draft })
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const draftsAtStart = await helper.draftsInDb()
      await api
        .delete('/api/upload/draft')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)
      const draftsAtEnd = await helper.draftsInDb()
      assert.strictEqual(draftsAtEnd.length, draftsAtStart.length - 1)
    })
  })
})

after(async () => {
  await sequelize.close()
})