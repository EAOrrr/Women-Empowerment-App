const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Article = require('../models/article')
const { connectToDatabase, sequelize } = require('../utils/db')

beforeEach(async () => {
  await connectToDatabase()
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
  // TODO: create a root user and login
  describe('when logged in as root user', () => {
    let headers

    beforeEach(async () => {
      const rootUser = {
        username: 'root',
        password: 'rootuser',
        role: 'admin'
      }

      await api
        .post('/api/users/pwd')
        .send(rootUser)
        .expect(201)

      const result = await api
        .post('/api/login/pwd')
        .send(rootUser)

      headers = {
        'Authorization': `Bearer ${result.body.token}`
      }
    })

    test('a valid article can be added', async () => {
      const articlesAtStart = await helper.articlesInDb()
      const newArticle = {
        title: 'first article',
        content: 'content of first article',
        author: 'first author',
        type: 'activity'
      }
      const response = await api
        .post('/api/articles')
        .send(newArticle)
        .set(headers)
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
      assert(titles.includes('first article'))
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
        .set(headers)
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
        .set(headers)
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
        .set(headers)
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
        .set(headers)
        .expect(400)
      const articlesAtEnd = await helper.articlesInDb()
      assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
    })
  })

  describe.only('logged in as normal user', () => {
    let headers

    beforeEach(async () => {
      const normalUser = {
        username: 'user',
        password: 'userpassword',
      }

      await api
        .post('/api/users/pwd')
        .send(normalUser)
        .expect(201)

      const result = await api
        .post('/api/login/pwd')
        .send(normalUser)

      headers = {
        'Authorization': `Bearer ${result.body.token}`
      }
    })

    test.only('not authorized to create an article', async () => {
      const articlesAtStart = await helper.articlesInDb()
      const newArticle = {
        title: 'an article',
        content: 'content of first article',
        type: 'law',
        author: 'first author'
      }
      await api
        .post('/api/articles')
        .send(newArticle)
        .set(headers)
        .expect(403)
      const articlesAtEnd = await helper.articlesInDb()
      assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
    })
  })

  describe('not logged in', () => {
    test('not authorized to create an article', async () => {
      const articlesAtStart = await helper.articlesInDb()
      const newArticle = {
        title: 'first article',
        content: 'content of first article',
        type: 'law',
        'author': 'first author'
      }
      await api
        .post('/api/articles')
        .send(newArticle)
        .expect(403)
      const articlesAtEnd = await helper.articlesInDb()
      assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
    })
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

  describe('fail with statuscode 403 if current permission is not sufficient to update that field', async () => {
    test('not log in ', async () => {
      const articlesAtStart = await helper.articlesInDb()
      const articleToUpdate = articlesAtStart[0]
      const updatedArticle = {
        title: 'new title'
      }
      await api
        .put(`/api/articles/${articleToUpdate.id}`)
        .send(updatedArticle)
        .expect(403)
      const articlesAtEnd = await helper.articlesInDb()
      const titles = articlesAtEnd.map(article => article.title)
      assert(!titles.includes('new title'))
    })

    test('logged in as normal user', async () => {
      const articles = await helper.articlesInDb()
      const articleToUpdate = articles[0]
      const updatedArticle = {
        title: 'new title'
      }
      const normalUser = {
        username: 'user',
        password: 'userpassword',
      }

      await api
        .post('/api/users/pwd')
        .send(normalUser)
        .expect(201)

      const result = await api
        .post('/api/login/pwd')
        .send(normalUser)

      const headers = {
        'Authorization': `Bearer ${result.body.token}`
      }

      await api
        .put(`/api/articles/${articleToUpdate.id}`)
        .send(updatedArticle)
        .set(headers)
        .expect(403)
    })
  })

  test('change title, content and type successfully as an admin user', async () => {
    const articlesAtStart = await helper.articlesInDb()
    const articleToUpdate = articlesAtStart[0]
    const updatedArticle = {
      title: 'new title',
      content: 'new content',
      type: 'activity'
    }
    const rootUser = {
      username: 'root',
      password: 'rootpasswrod',
      role: 'admin'
    }
    await api
      .post('/api/users/pwd')
      .send(rootUser)
      .expect(201)

    const result = await api
      .post('/api/login/pwd')
      .send(rootUser)

    const headers = {
      'Authorization': `Bearer ${result.body.token}`
    }

    await api
      .put(`/api/articles/${articleToUpdate.id}`)
      .send(updatedArticle)
      .set(headers)
      .expect(200)
    const articlesAtEnd = await helper.articlesInDb()
    assert.strictEqual(articlesAtEnd.length, articlesAtStart.length)
    const titles = articlesAtEnd.map(article => article.title)
    assert(titles.includes('new title'))
  })
})


after(async () => {
  await Article.destroy({ where: {} })
  sequelize.close()
})