const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const { Post, User, } = require('../models')
const { connectToDatabase, sequelize } = require('../utils/db')

beforeEach(async () => {
  await connectToDatabase()
  // empty the database
  await Post.destroy({ where: {} })
  await User.destroy({ where: {} })
})

describe('get infomation of posts', () => {
  beforeEach(async () => {
    const user = {
      username: 'user',
      password: 'password',
    }

    const createdUser = await api
      .post('/api/users/pwd')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const initialPosts = helper.initialPosts
      .map(p => (
        {
          ...p,
          userId: createdUser.body.userId
        }
      ))
    Post.bulkCreate(initialPosts)
    const postsInDb = await helper.postsInDb()
    console.log('postinDb', postsInDb)
  })

  test.only('there are three posts', async() => {
    const response = await api
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
    assert.strictEqual(response.body.length, helper.initialPosts.length)
  })
})

describe('addition of post', () => {
  let headers
  beforeEach(async () => {
    const user = {
      username: 'root',
      password: 'rootpassword'
    }
    await api
      .post('/api/users/pwd')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .post('/api/login/pwd')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const token = result.body.token
    headers = {
      'Authorization': `Bearer ${token}`
    }
  })

  test('a valid post can be added', async () => {
    const postsAtStart = await helper.postsInDb()
    const newPost = {
      title: 'This is a test post',
      content: 'This is the content of the test post'
    }
    const response = await api
      .post('/api/posts')
      .set(headers)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    console.log(response.body)
    const postsAtEnd = await helper.postsInDb()
    assert(postsAtEnd.length === postsAtStart.length + 1)
    const titles = postsAtEnd.map(post => post.title)
    assert(titles.includes('This is a test post'))
  })
})


describe('deletion of post', () => {
  let creatorToken
  let postToDelete
  let startLength
  beforeEach(async () => {
    const postsAtStart = await helper.postsInDb()
    startLength = postsAtStart.length
    const newUser = {
      username: 'testuser',
      password: 'testpassword'
    }
    await api
      .post('/api/users/pwd')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .post('/api/login/pwd')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    creatorToken = result.body.token
    const headers = { 'Authorization': `Bearer ${creatorToken}` }
    const newPost = {
      title: 'This is a test post',
      content: 'This is the test content'
    }
    const response = await api.post('/api/posts')
      .set(headers)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    postToDelete = response.body
    const posts = await helper.postsInDb()
    assert.strictEqual(posts.length, postsAtStart.length + 1)

  })

  test('a post can be deleted by its creator', async () => {

    const headers = { 'Authorization': `Bearer ${creatorToken}` }
    await api
      .delete(`/api/posts/${postToDelete.id}`)
      .set(headers)
      .expect(204)
    const postsAtEnd = await helper.postsInDb()
    assert.strictEqual(postsAtEnd.length, startLength)
    const titles = postsAtEnd.map(post => post.title)
    assert(!titles.includes(postToDelete.title))
  })

  test('a post can be deleted by admin user', async () => {
    const adminUser = {
      username: 'admin',
      password: 'adminpassword',
      role: 'admin'
    }
    await api
      .post('/api/users/pwd')
      .send(adminUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .post('/api/login/pwd')
      .send(adminUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const adminToken = result.body.token
    const headers = { 'Authorization': `Bearer ${adminToken}` }
    await api
      .delete(`/api/posts/${postToDelete.id}`)
      .set(headers)
      .expect(204)
    const postsAtEnd = await helper.postsInDb()
    assert.strictEqual(postsAtEnd.length, startLength)
  })

  test('a post cannot be deleted by other users', async () => {
    const newUser = {
      username: 'anotheruser',
      password: 'anotherpassword'
    }
    await api
      .post('/api/users/pwd')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .post('/api/login/pwd')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const anotherToken = result.body.token
    const headers = { 'Authorization': `Bearer ${anotherToken}` }
    await api
      .delete(`/api/posts/${postToDelete.id}`)
      .set(headers)
      .expect(403)
    const postsAtEnd = await helper.postsInDb()
    assert.strictEqual(postsAtEnd.length, startLength + 1)
  })
})

describe('update of post', () => {
  let creatorToken
  let postToUpdate
  beforeEach(async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword'
    }
    await api
      .post('/api/users/pwd')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await api
      .post('/api/login/pwd')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    creatorToken = result.body.token
    const headers = { 'Authorization': `Bearer ${creatorToken}` }
    const newPost = {
      title: 'This is a test post',
      content: 'This is the test content'
    }
    const response = await api.post('/api/posts')
      .set(headers)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    postToUpdate = response.body
  })

  test('views and likes can be changed by any users' , async () => {
    const updatedPost = {
      views: 100,
      likes: 50
    }
    const response = await api
      .put(`/api/posts/${postToUpdate.id}`)
      .send(updatedPost)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.views, updatedPost.views)
    assert.strictEqual(response.body.likes, updatedPost.likes)
  })

  test('status can be chaneged by the creator', async () => {
    const updatedPost = {
      status: 'done'
    }
    const headers = { 'Authorization': `Bearer ${creatorToken}` }
    await api
      .put(`/api/posts/${postToUpdate.id}`)
      .set(headers)
      .send(updatedPost)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const posts = await helper.postsInDb()
    const post = posts.find(p => p.id === postToUpdate.id)
    assert.strictEqual(post.status, updatedPost.status)
  })

  test('status cannot be changed by other users', async () => {
    const otherUser = {
      username: 'anotheruser',
      password: 'anotherpassword',
      role: 'admin'
    }
    await api
      .post('/api/users/pwd')
      .send(otherUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const result = await api
      .post('/api/login/pwd')
      .send(otherUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const headers = { 'Authorization': `Bearer ${result.body.token}` }
    const updatedPost = {
      status: 'done'
    }
    await api
      .put(`/api/posts/${postToUpdate.id}`)
      .set(headers)
      .send(updatedPost)
      .expect(403)
  })

})

after(async () => {
  await Post.destroy({ where: {} })
  sequelize.close()
})