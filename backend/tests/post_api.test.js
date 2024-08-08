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
})

describe('Get Post Information', () => {
  test('')
})

after(async () => {
  await Post.destroy({ where: {} })
  sequelize.close()
})