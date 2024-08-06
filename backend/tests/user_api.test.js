const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const { connectToDatabase } = require('../utils/db')

describe('test User model', () => {
  beforeEach(async () => {
    // empty the database
    await connectToDatabase()
    await User.destroy({ where: {} })
  })

  test('create a new user', async () => {
    const newUser1 = {
      username: 'testuser',
      password: 'testpassword',
      admin: true,
    }
    const newUser2 = {
      username: 'testuser2',
      password: 'testpassword2',
      admin: true,
    }

    await api
      .post('/api/users')
      .send(newUser1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    await api
      .post('/api/users')
      .send(newUser2)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await helper.usersInDb()
    assert.strictEqual(users.length, 2)
    const usernames = users.map(user => user.username)
    assert(usernames.includes('testuser'))
    assert(usernames.includes('testuser2'))
  })

  test('create a new user with invalid password', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'testuser',
      password: 'no',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await User.destroy({ where: {} })
})