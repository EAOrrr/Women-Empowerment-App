const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Article = require('../models/article')

beforeEach(async () => {
  // TODO: create a root user and login 

  // init articles
  await Article.destroy({ where: {} })
  await Article.bulkCreate(helper.initialArticles)
})

describe('Get article information', () => {
  test('articles are returned as json', async () => {
    await api
      .get('/api/articles')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two articles', async () => {
    const response = await api.get('/api/articles').expect(200)
    assert.strictEqual(response.body.length, helper.initialArticles.length)
  })
})

describe.only('Create a new article', () => {
  test('a valid article can be added', async () => {
    const articlesAtStart = await helper.articlesInDb()
    const newArticle = {
      title: 'New Article',
      content: 'This is a new article',
      type: 'policy',
      author: 'new author',
    }
    const response = await api
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .expect('Content-Type', /application\/json/)

    const returnedArticle = response.body
    assert.strictEqual(returnedArticle.title, newArticle.title)
    assert.strictEqual(returnedArticle.content, newArticle.content)
    assert.strictEqual(returnedArticle.type, newArticle.type)
    assert.strictEqual(returnedArticle.author, newArticle.author)

    const articlesAtEnd = await helper.articlesInDb()
    assert.strictEqual(articlesAtEnd.length, articlesAtStart.length + 1)
    const titles = articlesAtEnd.map(article => article.title)
    assert(titles.includes('New Article'))
  })

  test('article without title is not added', async () => {
    const articlesAtStart = await helper.articlesInDb()
    const newArticle = {
      content: 'This is a new article',
      type: 'policy',
    }
    await api
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
    const articlesAtEnd = await helper.articlesInDb()
    assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
  })

  test('article without content is not added', async () => {
    const articlesAtStart = await helper.articlesInDb()
    const newArticle = {
      title: 'New Article',
      type: 'policy',
    }
    await api
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
    const articlesAtEnd = await helper.articlesInDb()
    assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
  })

  test('article without type is not added', async () => {
    const articlesAtStart = await helper.articlesInDb()
    const newArticle = {
      title: 'New Article',
      content: 'This is a new article',
    }
    await api
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
    const articlesAtEnd = await helper.articlesInDb()
    assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
  })

  test('article with invalid type is not added', async () => {
    const articlesAtStart = await helper.articlesInDb()
    const newArticle = {
      title: 'New Article',
      content: 'This is a new article',
      type: 'invalid',
    }
    await api
      .post('/api/articles')
      .send(newArticle)
      .expect(400)
    const articlesAtEnd = await helper.articlesInDb()
    assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
  })

})

describe('Viewing a specific article', () => {
  test('succeeds with a valid id', async () => {
    const articles = await helper.articlesInDb()
    console.log(articles)
    const articleToView = articles[0]
    const resultArticle = await api
      .get(`/api/articles/${articleToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(resultArticle.body)
    const processedArticleToView = JSON.parse(JSON.stringify(articleToView))
    assert.deepStrictEqual(resultArticle.body, processedArticleToView)
  })

  test('fails with statuscode 404 if article does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api
      .get(`/api/articles/${validNonexistingId}`)
      .expect(404)
  })
})  

describe('Updating an article', () => {
  test('succeeds with a valid id', async () => {
    const articles = await helper.articlesInDb()
    const articleToUpdate = articles[0]
    const updatedArticle = {
      views: 100,
      likes: 200
    }
    const resultArticle = await api
      .put(`/api/articles/${articleToUpdate.id}`)
      .send(updatedArticle)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(resultArticle.body.views, updatedArticle.views)
    assert.strictEqual(resultArticle.body.likes, updatedArticle.likes)
    assert.strictEqual(resultArticle.body.title, articleToUpdate.title)
    assert.strictEqual(resultArticle.body.content, articleToUpdate.content)
    assert.strictEqual(resultArticle.body.type, articleToUpdate.type)
    assert.strictEqual(resultArticle.body.author, articleToUpdate.author)
  })

  test('fails with statuscode 404 if article does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api
      .put(`/api/articles/${validNonexistingId}`)
      .expect(404)
  })

  test('fail with statuscode 403 if current permission is not sufficient to update that field', async () => {
    // TODO: implement authorization
  })
})


after(async () => {
  await Article.destroy({ where: {} })

})