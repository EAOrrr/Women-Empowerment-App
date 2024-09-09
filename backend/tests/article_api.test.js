const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../src/app')
const supertest = require('supertest')
const api = supertest(app)
const { connectToDatabase, sequelize } = require('../src/utils/db')
const { User, Article } = require('../src/models')
const { decodeCursor } = require('../src/utils/helper')

beforeEach(async () => {
  await connectToDatabase()
  // init articles
  await Article.destroy({ where: {} })
  await User.destroy({ where: {} })
  await Article.bulkCreate(helper.initialArticles)
})


describe('Get article information', () => {
  test('articles are returned as json', async () => {
    const response = await api
      .get('/api/articles')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
  })


  test('there are eight articles', async () => {
    const response = await api.get('/api/articles').expect(200)
    assert.strictEqual(response.body.articles.length, helper.initialArticles.length)
  })

  test('article contains title, abstract, author, type, views,\
     likes, and id, but not content', async () => {
    const response = await api.get('/api/articles').expect(200)
    const articles = response.body.articles
    const titles = articles.map(article => article.title)
    const abstracts = articles.map(article => article.abstract)
    const authors = articles.map(article => article.author)
    const types = articles.map(article => article.type)
    const views = articles.map(article => article.views)
    const likes = articles.map(article => article.likes)
    const ids = articles.map(article => article.id)
    const contents = articles.map(article => article.content)
    assert(titles.every(title => title !== undefined))
    assert(abstracts.every(abstract => abstract !== undefined))
    assert(authors.every(author => author !== undefined))
    assert(types.every(type => type !== undefined))
    assert(views.every(view => view !== undefined))
    assert(likes.every(like => like !== undefined))
    assert(ids.every(id => id !== undefined))
    assert(contents.every(content => content === undefined))
  })


})

describe('Create a new article', () => {
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

    test('abstract will be created automatically', async () => {
      const articlesAtStart = await helper.articlesInDb()
      const newArticle = {
        title: 'New Article',
        content: 'This is a new article'.repeat(20),
        type: 'policy',
      }
      console.log(newArticle)
      // exit()
      const response = await api
        .post('/api/articles')
        .send(newArticle)
        .set(headers)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const returnedArticle = response.body
      assert.strictEqual(returnedArticle.abstract, newArticle.content.substring(0, 50))
      const articlesAtEnd = await helper.articlesInDb()
      assert.strictEqual(articlesAtEnd.length, articlesAtStart.length + 1)
      const titles = articlesAtEnd.map(article => article.title)
      assert(titles.includes('New Article'))
    })

  })

  describe('logged in as normal user', () => {
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

    test('not authorized to create an article', async () => {
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
        .expect(401)
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
    delete processedArticleToView.abstract
    assert.deepStrictEqual(
      resultArticle.body, 
      processedArticleToView,
    )
  })

  test.only('fails with statuscode 404 if article does not exist', async () => {
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
      // .set('Authorization', `Bearer ${token}`)
      // .expect(200)
      // .expect('Content-Type', /application\/json/)
    console.log(resultArticle.body)
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

describe('Get article with query', () => {
  test('get articles with query limit', async () => {
    const response = await api
      .get('/api/articles?limit=3')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
    const articles = response.body.articles
    assert.strictEqual(articles.length, 3)
  })

  test('get article with query limit and cursor', async() => {
    const articlesInDb = await Article.findAll({
      order: [['views', 'DESC'], ['id', 'ASC']]
    })
    assert(articlesInDb.length === 8)
    console.log(articlesInDb.map(a => a.toJSON()))
    const response = await api
      .get('/api/articles?limit=3&ordering=views')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const cursor = response.body.cursor
    console.log(cursor, decodeCursor(cursor))
    const response2 = await api
      .get(`/api/articles?limit=3&cursor=${cursor}&ordering=views`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { cursor: cursor2 } = response2.body
    console.log(response2.body)
    const response3 = await api
      .get(`/api/articles?limit=3&cursor=${cursor2}&ordering=views`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response3.body.articles.length, 2)
    assert.strictEqual(response2.body.articles.length, 3)
    assert(response3.body.articles[0].views <= response2.body.articles[2].views)
    assert(response2.body.articles[0].views <= response.body.articles[2].views)
    for (let i = 0; i < response.body.articles.length - 1; i++) {
      assert(response.body.articles[i].views >= response.body.articles[i+1].views)
    }
    for (let i = 0; i < response2.body.articles.length - 1; i++) {
      assert(response2.body.articles[i].views >= response2.body.articles[i+1].views)
    }
    for (let i = 0; i < response3.body.articles.length - 1; i++) {
      assert(response3.body.articles[i].views >= response3.body.articles[i+1].views)
    }

  })

  test('get articles with query a single tag', async () => {
    const response = await api
      .get('/api/articles?tags=tag1')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles = response.body.articles
    assert.strictEqual(articles.length, 6)
    assert(articles.every(article => article.tags.includes('tag1')))
  })

  test('get articles with query multiple tags', async () => {
    const response = await api
      .get('/api/articles?tags=tag1,tag2')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles = response.body.articles
    assert.strictEqual(articles.length, 3)
    assert(articles.every(article => article.tags.includes('tag1') || article.tags.includes('tag2')))
  })

  test('get articles with query type', async () => {
    const response = await api
      .get('/api/articles?type=policy')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles = response.body.articles
    assert.strictEqual(articles.length, 6)
    assert(articles.every(article => article.type === 'policy'))
  })

  test('get articles with query keyword', async () => {
    const response = await api
      .get('/api/articles?keyword=first')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles = response.body.articles
    assert.strictEqual(articles.length, 4)
    console.log(articles)
  })

  test('get articles with query keyword and type', async () => {
    const response = await api
      .get('/api/articles?keyword=first&type=policy')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles = response.body.articles
    assert(!response.body.count)
    assert.strictEqual(articles.length, 3)
    assert(articles.every(article => article.type === 'policy'))
    // assert(articles.every(article => article.title.includes('first')))
    console.log(articles)
  })

  test('get articles with query ordering and tags and limit', async () => {
    const response = await api
      .get('/api/articles?ordering=views&tags=tag1&limit=3&total=true')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.count, 6)
    const articles = response.body.articles
    assert.strictEqual(articles.length, 3)
    assert(articles.every(article => article.tags.includes('tag1')))
    for (let i = 0; i < articles.length - 1; i++) {
      assert(articles[i].views >= articles[i+1].views)
    }
    const cursor = response.body.cursor
    const response2 = await api
      .get(`/api/articles?ordering=views&tags=tag1&limit=3&cursor=${cursor}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles2 = response2.body.articles
    assert.strictEqual(articles2.length, 3)
    assert(articles2.every(article => article.tags.includes('tag1')))
    for (let i = 0; i < articles2.length - 1; i++) {
      assert(articles2[i].views >= articles2[i+1].views)
    }
    const cursor2 = response2.body.cursor
    const response3 = await api
      .get(`/api/articles?ordering=views&tags=tag1&limit=3&cursor=${cursor2}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles3 = response3.body.articles
    assert.strictEqual(articles3.length, 0)
  })

  test('get articles with query invalid ordering', async () => {
    await api
      .get('/api/articles?ordering=invalid')
      .expect(400)
  })

  test('get article with limit and offset', async () => {
    const response = await api
      .get('/api/articles?limit=3&offset=4&ordering=views')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles = response.body.articles
    assert.strictEqual(articles.length, 3)
    for (let i = 0; i < articles.length - 1; i++) {
      assert(articles[i].views >= articles[i+1].views)
    }
    console.log(articles)
  })

  test('cannot use both cursor and offset', async () => {
    const res = await api
      .get('/api/articles?limit=3&offset=4&cursor=123')
      .expect(400)
    assert.strictEqual(res.body.error, 'Cannot use both cursor and offset')
  })

  test('get articles with total count', async () => {
    const response = await api
      .get('/api/articles?total=true')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.count, 8)
  })

  test('get articles with invalid ordering field', async () => {
    const response = await api
      .get('/api/articles?ordering=invalid')
      .expect(400)
    assert.strictEqual(response.body.error.message, 'Invalid ordering field')
  })

  test('test created-at ordering', async () => {
    const response = await api
      .get('/api/articles?ordering=createdAt')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const articles = response.body.articles
    for (let i = 0; i < articles.length - 1; i++) {
      assert(articles[i].createdAt >= articles[i+1].createdAt)
    }
  })
})

after(async () => {
  await Article.destroy({ where: {} })
  sequelize.close()
})