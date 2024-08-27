const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const { User, Follow, Article, Post, Recruitment } = require('../models')
const app = require('../app')
const supertest = require('supertest')
const { connectToDatabase, sequelize } = require('../utils/db')
const api = supertest(app)
beforeEach(async () => {
  await connectToDatabase()
  // await sequelize.sync({ force: true });
  await Article.destroy({ where: {} })
  await User.destroy({ where: {} })
  await Follow.destroy({ where: {} })
  await Post.destroy({ where: {} })
  await Recruitment.destroy({ where: {} })

})

describe('Follow Articles', () => {
  let userId
  let userToken
  beforeEach(async () => {
    const user = {
      username: 'test',
      password: 'password',
    }
    const createResponse = await helper.createUser(api, user)
    userId = createResponse.userId
    userToken = await helper.getToken(api, user)
    console.log(userToken)
    await Article.bulkCreate(
      helper.initialArticles
    )
    const articlesInDb = await helper.articlesInDb()
    assert(articlesInDb.length === helper.initialArticles.length)
  })

  describe('Follow function', () => {
    test('should follow an article', async () => {
      const followsAtStart = await Follow.findAll()

      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[0]
      const response = await api
        .post(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)

      console.log(response.body)
      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length + 1)
      const follow = followsAtEnd[0]
      assert(follow.followerId === userId)
      assert(follow.followableId === article.id)
      assert(follow.followableType === 'article')
      console.log(followsAtEnd[0].toJSON())
    })

    test('should not follow an article without token', async () => {
      const followsAtStart = await Follow.findAll()

      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[0]
      const response = await api
        .post(`/api/articles/${article.id}/follow`)
        .expect(401)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })

    test('should not follow an article twice', async () => {
      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[0]
      await api
        .post(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
      const followsAtStart = await Follow.findAll()
      const response = await api
        .post(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(409)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })
  })

  describe('Unfollow function', () => {
    beforeEach(async () => {
      const followsAtStart = await Follow.findAll()
      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[0]
      await api
        .post(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length + 1)
    })

    test('should unfollow an article', async () => {
      const followsAtStart = await Follow.findAll()
      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[0]
      const response = await api
        .delete(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length - 1)
    })

    test('should not unfollow an article without token', async () => {
      const followsAtStart = await Follow.findAll()
      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[0]
      const response = await api
        .delete(`/api/articles/${article.id}/follow`)
        .expect(401)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })

    test('should not unfollow an article twice', async () => {
      const followsAtStart = await Follow.findAll()
      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[0]
      await api
        .delete(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)
      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length - 1)
      const response = await api
        .delete(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404)
      const followsAtEnd2 = await Follow.findAll()
      assert.strictEqual(followsAtEnd2.length, followsAtEnd.length)
    })

    test('should not unfollow an article that is not followed', async () => {
      const followsAtStart = await Follow.findAll()
      const articlesInDb = await helper.articlesInDb()
      const article = articlesInDb[1]
      const response = await api
        .delete(`/api/articles/${article.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })
  })

})

describe.only(' Users Get Follows', () => {
  let userId, userToken
  beforeEach(async () => {
    const user = {
      username: 'test',
      password: 'password',
    }
    const createResponse = await helper.createUser(api, user)
    userId = createResponse.userId
    userToken = await helper.getToken(api, user)
    console.log(userToken)
    await Article.bulkCreate(
      helper.initialArticles
    )
    const articlesInDb = await helper.articlesInDb()
    assert(articlesInDb.length === helper.initialArticles.length)
    await Post.bulkCreate(
      helper.initialPosts.map(
        p => ({ ...p, userId })
      )
    )
    const postsInDb = await helper.postsInDb()
    assert(postsInDb.length === helper.initialPosts.length)
    const article = articlesInDb[0]
    await Recruitment.bulkCreate(
      helper.initialRecruitments
    )
    const recruitmentsInDb = await Recruitment.findAll()
    assert(recruitmentsInDb.length === helper.initialRecruitments.length)
    const recruitment = recruitmentsInDb[0]
    await api
      .post(`/api/recruitments/${recruitment.id}/follow`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)
    await api
      .post(`/api/articles/${article.id}/follow`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)
    const post = postsInDb[0]
    await api
      .post(`/api/posts/${post.id}/follow`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)

  })

  test.only('should get all follows of a user', async () => {
    const follows = await helper.followsInDb()
    console.log(follows)
    const response = await api
      .get('/api/users/me/follows')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    const { articles, posts, recruitments } = response.body
    assert.strictEqual(articles.length, 1)
    assert.strictEqual(posts.length, 1)
    assert.strictEqual(recruitments.length, 1)
    console.log(response.body)
  })

  test.only('get followed articles', async () => {
    const response = await api
      .get('/api/users/me/follows/articles')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    assert.strictEqual(response.body.length, 1)
    console.log(response.body)
  })

  test.only('get followed posts', async () => {
    const response = await api
      .get('/api/users/me/follows/posts')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    assert.strictEqual(response.body.length, 1)
    console.log(response.body)
  })

  test.only('get followed recruitments', async () => {
    const response = await api
      .get('/api/users/me/follows/recruitments')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    assert.strictEqual(response.body.length, 1)
    console.log(response.body)
  })
})



describe('Follow Posts', () => {
  let userId
  let userToken
  beforeEach(async () => {
    const user = {
      username: 'test',
      password: 'password',
    }
    const createResponse = await helper.createUser(api, user)
    userId = createResponse.userId
    userToken = await helper.getToken(api, user)
    await Post.bulkCreate(
      helper.initialPosts.map(
        p => ({ ...p, userId })
      )
    )
    const postsInDb = await helper.postsInDb()
    assert(postsInDb.length === helper.initialPosts.length)
  })

  test('should follow a post', async () => {
    const followsAtStart = await Follow.findAll()

    const postsInDb = await helper.postsInDb()
    const post = postsInDb[0]
    const response = await api
      .post(`/api/posts/${post.id}/follow`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)

    const followsAtEnd = await Follow.findAll()
    assert(followsAtEnd.length === followsAtStart.length + 1)
    const follow = followsAtEnd[0]
    assert(follow.followerId === userId)
    assert(follow.followableId === post.id)
    assert(follow.followableType === 'post')
  })

  test('should not follow a post without token', async () => {
    const followsAtStart = await Follow.findAll()

    const postsInDb = await helper.postsInDb()
    const post = postsInDb[0]
    const response = await api
      .post(`/api/posts/${post.id}/follow`)
      .expect(401)

    const followsAtEnd = await Follow.findAll()
    assert(followsAtEnd.length === followsAtStart.length)
  })

  test('should not follow a post twice', async () => {
    const postsInDb = await helper.postsInDb()
    const post = postsInDb[0]
    await api
      .post(`/api/posts/${post.id}/follow`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)
    const followsAtStart = await Follow.findAll()
    const response = await api
      .post(`/api/posts/${post.id}/follow`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(409)

    const followsAtEnd = await Follow.findAll()
    assert(followsAtEnd.length === followsAtStart.length)
  })
})

describe('Follow Recruitments', () => {
  let userId
  let userToken
  beforeEach(async () => {
    const user = {
      username: 'test',
      password: 'password',
    }
    const createResponse = await helper.createUser(api, user)
    userId = createResponse.userId
    userToken = await helper.getToken(api, user)
    await Recruitment.bulkCreate(
      helper.initialRecruitments
    )
    const recruitmentsInDb = await Recruitment.findAll()
    assert(recruitmentsInDb.length === helper.initialRecruitments.length)
  })
  describe('test follow function', () => {
    test('should follow a recruitment', async () => {
      const followsAtStart = await Follow.findAll()

      const recruitmentsInDb = await Recruitment.findAll()
      const recruitment = recruitmentsInDb[0]
      const response = await api
        .post(`/api/recruitments/${recruitment.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length + 1)
      const follow = followsAtEnd[0]
      assert(follow.followerId === userId)
      assert(follow.followableId === recruitment.id)
      assert(follow.followableType === 'recruitment')
    })

    test('should not follow a recruitment without token', async () => {
      const followsAtStart = await Follow.findAll()

      const recruitmentsInDb = await Recruitment.findAll()
      const recruitment = recruitmentsInDb[0]
      const response = await api
        .post(`/api/recruitments/${recruitment.id}/follow`)
        .expect(401)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })

    test('should not follow a recruitment twice', async () => {
      const recruitmentsInDb = await Recruitment.findAll()
      const recruitment = recruitmentsInDb[0]
      await api
        .post(`/api/recruitments/${recruitment.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
      const followsAtStart = await Follow.findAll()
      const response = await api
        .post(`/api/recruitments/${recruitment.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(409)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })

    test('should not follow a recruitment that does not exist', async () => {
      const followsAtStart = await Follow.findAll()
      const nonExistingId = await helper.nonExistingId()

      const response = await api
        .post(`/api/recruitments/${nonExistingId}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })
  })
  
  describe('test unfollow function', () => {
    beforeEach(async () => {
      const followsAtStart = await Follow.findAll()
      
      const recruitmentsInDb = await Recruitment.findAll()
      const recruitment = recruitmentsInDb[0]
      await api
        .post(`/api/recruitments/${recruitment.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length + 1)
    })

    test('should unfollow a recruitment', async () => {
      const followsAtStart = await Follow.findAll()
      const recruitmentsInDb = await Recruitment.findAll()
      const recruitment = recruitmentsInDb[0]
      const response = await api
        .delete(`/api/recruitments/${recruitment.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length - 1)
    })
/*
    test('should not unfollow a recruitment without token', async () => {
      const followsAtStart = await Follow.findAll()
      const recruitmentsInDb = await Recruitment.findAll()
      const recruitment = recruitmentsInDb[0]
      const response = await api
        .delete(`/api/recruitments/${recruitment.id}/follow`)
        .expect(401)

      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length)
    })

    test('should not unfollow a recruitment twice', async () => {
      const followsAtStart = await Follow.findAll()
      const recruitmentsInDb = await Recruitment.findAll()
      const recruitment = recruitmentsInDb[0]
      await api
        .delete(`/api/recruitments/${recruitment.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)
      const followsAtEnd = await Follow.findAll()
      assert(followsAtEnd.length === followsAtStart.length - 1)
      const response = await api
        .delete(`/api/recruitments/${recruitment.id}/follow`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404)
      const followsAtEnd2 = await Follow.findAll()
      assert.strictEqual(followsAtEnd2.length, followsAtEnd.length)
    })
    */
  })


})




after(async () => {
  await Article.destroy({ where: {} })
  await User.destroy({ where: {} })
  await Follow.destroy({ where: {} })
  await Post.destroy({ where: {} })
  await sequelize.close()
})
