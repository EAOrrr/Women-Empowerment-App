const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const { connectToDatabase, sequelize } = require('../utils/db')

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

describe.only('get all user info with admin', () => {
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
  test.only('get all user info with admin', async () => {
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

after(async () => {
  await User.destroy({ where: {} })
  sequelize.close()
})