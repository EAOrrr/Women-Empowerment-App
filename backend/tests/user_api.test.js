const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const { connectToDatabase } = require('../utils/db')

beforeEach(async () => {
  // empty the database
  await connectToDatabase()
  await User.destroy({ where: {} })
})
describe('test User model', () => {
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
      .post('/api/users/pwd')
      .send(newUser1)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    await api
      .post('/api/users/pwd')
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
      .post('/api/users/pwd')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('update a user password', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      admin: true,
    }
    const user = await api
      .post('/api/users/pwd')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const updatedUser = {
      password: 'newpassword',
    }
    const updated = await api
      .put(`/api/users/${user.body.id}`)
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert(updated.body.password !== user.body.password)
  })

  test('update a user password with invalid password', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      admin: true,
    }
    const user = await api
      .post('/api/users/pwd')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const updatedUser = {
      password: 'no',
    }
    await api
      .put(`/api/users/${user.body.id}`)
      .send(updatedUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('update a user info', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      phone: '123456789',
      admin: true,
    }
    const user = await api
      .post('/api/users/pwd')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const updatedUser = {
      phone: '987654321',
    }
    const updated = await api
      .put(`/api/users/${user.body.id}`)
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.notStrictEqual(updated.body.phone, user.body.phone)
    assert.strictEqual(updated.body.phone, '987654321')
  })

})

describe('test login (with pwd) function', () => {
  beforeEach(async () => {
    // empty the database
    const user = {
      username: 'testuser',
      password: 'testpassword',
    }
    await api
      .post('/api/users/pwd')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('login with correct username and password', async () => {
    const user = {
      username: 'testuser',
      password: 'testpassword',
    }
    await api
      .post('/api/login/pwd')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('login with incorrect username', async () => {
    const user = {
      username: 'wronguser',
      password: 'testpassword',
    }
    await api
      .post('/api/login/pwd')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login with incorrect password', async () => {
    const user = {
      username: 'testuser',
      password: 'wrongpassword',
    }
    await api
      .post('/api/login/pwd')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})
after(async () => {
  await User.destroy({ where: {} })
})