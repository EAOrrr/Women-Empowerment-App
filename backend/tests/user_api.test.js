const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const { connectToDatabase, sequelize } = require('../utils/db')
const { Notification } = require('../models')

beforeEach(async () => {
  // empty the database
  await connectToDatabase()
  await User.destroy({ where: {} })
})
describe('create a user', () => {
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

  test('create a new user with returned field id and username', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      role: 'admin'
    }
    const response = await api
      .post('/api/users/pwd')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const user = response.body
    assert(user.userId !== undefined)
    assert(user.username !== undefined)
    assert(user.password === undefined)
    assert(user.role === undefined)
  })
})

describe('update a user', () => {

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

    const result = await api
      .post('/api/login/pwd')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const headers = { 'Authorization': `Bearer ${result.body.token}` }
    const updatedUser = {
      password: 'newpassword',
    }
    const updated = await api
      .put('/api/users/me')
      .send(updatedUser)
      .set(headers)
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

    const headers = { 'Authorization': `Bearer ${result.body.token}` }

    const updatedUser = {
      password: 'no',
    }
    await api
      .put('/api/users/me')
      .send(updatedUser)
      .set(headers)
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
    const result = await api
      .post('/api/login/pwd')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const headers = { 'Authorization': `Bearer ${result.body.token}` }

    const updatedUser = {
      phone: '987654321',
    }
    const updated = await api
      .put('/api/users/me')
      .send(updatedUser)
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.notStrictEqual(updated.body.phone, user.body.phone)
    assert.strictEqual(updated.body.phone, '987654321')
  })

  test('update a user info with invalid field', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
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

    const headers = { 'Authorization': `Bearer ${result.body.token}` }
    const updatedUser = {
      role: 'admin'
    }

    await api
      .put('/api/users/me')
      .send(updatedUser)
      .set(headers)
      .expect(403)
      .expect('Content-Type', /application\/json/)
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

describe('get a user info', () => {
  test('get a user info', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
      role: 'admin',
      phone: '123456789',
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
    const headers = { 'Authorization': `Bearer ${result.body.token}` }
    await api
      .put('/api/users/me')
      .send({ phone: newUser.phone })
      .set(headers)
      .expect(200)

    const response = await api
      .get('/api/users/me')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const user = response.body
    assert.strictEqual(user.username, newUser.username)
    assert.strictEqual(user.phone, newUser.phone)
    assert(user.role === undefined)
    assert(user.password === undefined)
    assert(user.userId)
  })
})

describe('get all user info with admin', () => {
  beforeEach(async () => {
    const initialUsers = [
      {
        username: 'testuser',
        password: 'testpassword',
        role: 'admin',
        phone: '123456789',
      },
      {
        username: 'testuser2',
        password: 'testpassword2',
        role: 'user',
        phone: '987654321',
      },
      {
        username: 'testuser3',
        password: 'testpassword3',
        role: 'user',
        phone: '135792468',
      }
    ]
    await User.bulkCreate(initialUsers)
  })
  test('get all user info with admin', async () => {
    const usersInDb = await helper.usersInDb()
    console.log(usersInDb)
    const newUser = {
      username: 'testuserAdmin',
      password: 'testpassword',
      role: 'admin',
      phone: '123456789',
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
    const headers = { 'Authorization': `Bearer ${result.body.token}` }

    const response = await api
      .get('/api/users')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const users = response.body
    console.log(users)
    assert.strictEqual(users.length, 4)
    const usernames = users.map(user => user.username)
    assert(usernames.includes('testuser'))
    assert(usernames.includes('testuser2'))
    assert(usernames.includes('testuser3'))
    assert(users.every(user => user.phone !== undefined))
    assert(users.every(user => user.role === undefined))
    assert(users.every(user => user.password === undefined))
    assert(users.every(user => user.id !== undefined))
  })
})

describe('test refresh token', () => {
  test.only('test refresh token', async () => {
    const newUser = {
      username: 'testuser',
      password: 'abcpassowred'
    }
    await helper.createUser(api, newUser)
    const result = await api
      .post('/api/login/pwd')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const { token, refreshToken } = result.body
    const response = await api
      .post('/api/login/refresh')
      .send({ refreshToken })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(token)
    console.log(response.body.token)
    assert(response.body.token !== token)
    assert(response.body.refreshToken !== refreshToken)
    // test new token function

    const newToken = response.body.token
    const headers = { 'Authorization': `Bearer ${newToken}` }
    await api
      .get('/api/users/me')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})


describe.only('test get notification count', () => {
  let user1Token, user2Token
  beforeEach(async () => {
    const user1 = {
      username: 'testuser1',
      password: 'testpassword',
    }
    const user2 = {
      username: 'testuser2',
      password: 'testpassword',
    }
    const response1 = await helper.createUser(api, user1)
    const response2 = await helper.createUser(api, user2)
    const user1Id = response1.userId
    const user2Id = response2.userId

    user1Token = await helper.getToken(api, user1)
    user2Token = await helper.getToken(api, user2)

    await Notification.bulkCreate(
      helper.initialNotifications.map(notification => ({
        ...notification,
        type: 'global',
        userId: user1Id,
      }))
    )

    await Notification.bulkCreate(
      helper.initialNotifications.concat({
        message: 'forth notification'
      })
        .map(notification => ({
          ...notification,
          type: 'global',
          userId: user2Id,
        }))
    )

  })

  test.only('get notification count', async () => {
    const headers = { 'Authorization': `Bearer ${user1Token}` }
    const response = await api
      .get('/api/users/me')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const user = response.body
    assert.strictEqual(user.notificationCount, 3)
  })

  test.only('get notification count with user2', async () => {
    const headers = { 'Authorization': `Bearer ${user2Token}` }
    const response = await api
      .get('/api/users/me')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const user = response.body
    assert.strictEqual(user.notificationCount, 4)
  })
})
after(async () => {
  await User.destroy({ where: {} })
  sequelize.close()
})