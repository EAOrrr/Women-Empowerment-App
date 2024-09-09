const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { connectToDatabase, sequelize } = require('../src/utils/db')
const { User, Article } = require('../src/models')

let adminToken, userToken
beforeEach(async () => {
  await connectToDatabase()
  await Article.destroy({ where: {} })
  await User.destroy({ where: {} })

  const adminUser = {
    username: 'admintest',
    password: '{{$timetamp}}',
    role: 'admin',
  }

  const normalUser = {
    username: 'usertest',
    password: '{{$timetamp}}',
    role: 'user',
  }

  await api.post('/api/users/pwd').send(adminUser)
  await api.post('/api/users/pwd').send(normalUser)
  adminToken = await helper.getToken(api, adminUser)
  userToken = await helper.getToken(api, normalUser)

  await Article.bulkCreate(helper.initialArticles)
})

describe.only('Rank article', () => {
  test.only('Rank article legally', async () => {
    const articlesInDb = await helper.articlesInDb()
    const article = articlesInDb.find(a => a.type === 'activity')
    const res = await api.post(`/api/articles/${article.id}/activity/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ score: 5 , content: 'a comment' })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.content, 'a comment')
    console.log(res.body)
    const articlesInDbAfter = await helper.articlesInDb()
    const updatedArticle = articlesInDbAfter.find(a => a.id === article.id)
    assert.strictEqual(updatedArticle.score, 5)
    assert.strictEqual(updatedArticle.numberOfScore, 1)
  })

  test('Rank article illegally', async () => {
    const articlesInDb = await helper.articlesInDb()
    const article = articlesInDb.find(a => a.type === 'activity')
    const res = await api.post(`/api/articles/${article.id}/activity/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ score: 6, content: 'a comment' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.error, 'Score must be between 1 and 5')
  })

  test('Rank non-activity article', async () => {
    const articlesInDb = await helper.articlesInDb()
    const article = articlesInDb.find(a => a.type !== 'activity')
    const res = await api.post(`/api/articles/${article.id}/activity/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ score: 5 })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.error, 'Only activity can be ranked and commented')
  })

  test('Rank an article multiple times', async () => {
    const articlesInDb = await helper.articlesInDb()
    const article = articlesInDb.find(a => a.type === 'activity')
    for (let i = 1; i <= 5 ; i++) {
      await api.post(`/api/articles/${article.id}/activity/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ score: i, content: 'a comment' })
        .expect(201)
    }
    const updatedArticle = await Article.findByPk(article.id)
    assert.strictEqual(updatedArticle.score, 15)
    assert.strictEqual(updatedArticle.numberOfScore, 5)
    const comments = await updatedArticle.getComments()
    assert.strictEqual(comments.length, 5)

  })
})

describe('Article API Comments', () => {
  let commentId, articleId
  beforeEach(async () => {
    const articlesInDb = await helper.articlesInDb()
    const article = articlesInDb.find(a => a.type === 'activity')
    articleId = article.id
    const commentRes = await api.post(`/api/articles/${article.id}/activity/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ score: 5, content: 'a comment' })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    commentId = commentRes.body.id
    await api.post(`/api/articles/${article.id}/activity/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ score: 5, content: 'a comment 2' })
      .expect(201)
  })

  test('Get comments of an article', async () => {
    const res = await api.get(`/api/articles/${articleId}/activity/comments`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.length, 2)
  })

  test('Delete comment of an article', async () => {
    await api.delete(`/api/articles/${articleId}/activity/comments/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204)
    const res = await api.get(`/api/articles/${articleId}/activity/comments`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.length, 1)
  })
  
  test('put comment of an article', async () => {
    const res = await api.put(`/api/articles/${articleId}/activity/comments/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ likes: 2 })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(res.body.likes, 2)
  })

})


after(async () => {
  await Article.destroy({ where: {} })
  // await User.destroy({ where: {} })
  await sequelize.close()
})