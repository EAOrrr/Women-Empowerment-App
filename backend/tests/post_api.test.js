const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const { Post, User, Comment, } = require('../models')
const { connectToDatabase, sequelize } = require('../utils/db')
const TestAgent = require('supertest/lib/agent')

beforeEach(async () => {
  await connectToDatabase()
  // empty the database
  await Post.destroy({ where: {} })
  await User.destroy({ where: {} })
})

describe.only('get infomation of posts', () => {
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
    await Post.bulkCreate(initialPosts)
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

  test('title and content cannot be changed', async () => {
    const updatedPost = {
      title: 'This is a new title',
      content: 'This is a new content'
    }
    const headers = { 'Authorization': `Bearer ${creatorToken}` }
    await api
      .put(`/api/posts/${postToUpdate.id}`)
      .send(updatedPost)
      .set(headers)
      .expect(403)
  })

})

describe.only('test comment function', () => {
  let creatorToken
  let postToComment
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
    postToComment = response.body
  })
  describe('addition of a comment', () => {
    test('a comment can be added to a post by the post owner', async () => {
      const commentsAtStart = await helper.commentsInDb()
      const newComment = {
        content: 'This is a test comment'
      }
      const response = await api
        .post(`/api/posts/${postToComment.id}/comments`)
        .set({ 'Authorization': `Bearer ${creatorToken}` })
        .send(newComment)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      console.log(response.body)
      assert.strictEqual(response.body.content, newComment.content)
      const commentsAtEnd = await helper.commentsInDb()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length + 1)
    })

    test('check comment return field', async () => {
      const newComment = {
        content: 'This is a test comment'
      }
      const response = await api
        .post(`/api/posts/${postToComment.id}/comments`)
        .set({ 'Authorization': `Bearer ${creatorToken}` })
        .send(newComment)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const comment = response.body
      assert(comment.id)
      assert.strictEqual(comment.content, newComment.content)
      assert(comment.createdAt)
      assert(comment.updatedAt)
      assert(comment.likes !== undefined)
      assert(comment.commenter)
      assert(comment.commenter.username === 'testuser')
      assert(comment.commenter.userId)
      assert.strictEqual(comment.commentedPost.postId, postToComment.id)
    })

    test('a comment can be added to a post by admin', async () => {
      const commentsAtStart = await helper.commentsInDb()
      const adminUser = {
        username: 'admin',
        password: 'adminpassword',
        role: 'admin',
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

      const headers = { 'Authorization': `Bearer ${result.body.token}` }
      const newComment = {
        content: 'This is a test comment'
      }
      await api
        .post(`/api/posts/${postToComment.id}/comments`)
        .set(headers)
        .send(newComment)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const commentsAtEnd = await helper.commentsInDb()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length + 1)
      const contents = commentsAtEnd.map(c => c.content)
      assert(contents.includes(newComment.content))
    })

    test('a comment cannot be added to a post by other users', async () => {
      const commentsAtStart = await helper.commentsInDb()
      const otherUser = {
        username: 'anotheruser',
        password: 'anotherpassword'
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
      await api
        .post(`/api/posts/${postToComment.id}/comments`)
        .set(headers)
        .send({ content: 'This is a test comment' })
        .expect(403)
      const commentsAtEnd = await helper.commentsInDb()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length)
    })
  })
  describe('update a comment', () => {
    let commentToUpdate
    beforeEach(async() => {
      const newComment = {
        content: 'This is a test comment'
      }
      const response = await api
        .post(`/api/posts/${postToComment.id}/comments`)
        .set({ 'Authorization': `Bearer ${creatorToken}` })
        .send(newComment)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      commentToUpdate = response.body
    })

    test('a comment\'s likes can be changded by anyone', async () => {
      const updatedComment = {
        likes: commentToUpdate.likes + 1
      }
      await api
        .put(`/api/posts/${postToComment.id}/comments/${commentToUpdate.id}`)
        .send(updatedComment)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const comments = await helper.commentsInDb()
      const comment = comments.find(c => c.id === commentToUpdate.id)
      assert.strictEqual(comment.likes, updatedComment.likes)
      assert.strictEqual(comment.content, commentToUpdate.content)
      assert.strictEqual(comment.commentableId, commentToUpdate.commentedPost.postId)
    })

    test('a comment\'s content cannot be changed', async () => {
      const updatedComment = {
        content: 'This is a new content'
      }
      await api
        .put(`/api/posts/${postToComment.id}/comments/${commentToUpdate.id}`)
        .send(updatedComment)
        .expect(403)
    })

    test('put return correct field', async () => {
      const updatedComment = {
        likes: commentToUpdate.likes + 1
      }
      const response = await api
        .put(`/api/posts/${postToComment.id}/comments/${commentToUpdate.id}`)
        .send(updatedComment)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const comment = response.body
      assert(comment.id)
      assert(comment.content)
      assert(comment.likes)
      assert(comment.createdAt)
      assert(comment.updatedAt)
      assert(comment.commenter)
      assert(comment.commenter.username === 'testuser')
      assert(comment.commenter.userId)
      assert(comment.commentedPost)
      assert(comment.commentedPost.postId === postToComment.id)
    })

  })

  describe.only('get api return correct amount of comment', () => {
    let anotherPostId
    beforeEach(async () => {
      Comment.destroy({ where: {} })
      const adminUser = {
        username: 'admin',
        password: 'adminpassword',
        role: 'admin'
      }
      const response = await api
        .post('/api/users/pwd')
        .send(adminUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const adminId = response.body.userId
      const newComments = helper.newComments
      await Comment.bulkCreate(newComments.map(c => {
        return {
          ...c,
          commentableType: 'post',
          commentableId: postToComment.id,
          userId: adminId
        }
      }))
      const anotherpost = await Post.create({
        title: 'another post',
        content: 'content of another post',
        userId: adminId
      })
      anotherPostId = anotherpost.id
      const ANewComments = newComments.concat({
        content: 'content of another comment',
      })
      ANewComments.push(...ANewComments)
      ANewComments.push(...ANewComments)
      ANewComments.push(...ANewComments)
      await Comment.bulkCreate(ANewComments.map(c => {
        return {
          ...c,
          commentableType: 'post',
          commentableId: anotherPostId,
          userId: adminId
        }
      }))
    })

    test('test get /api/posts', async () => {
      const response = await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      console.log(response.body)
      assert.strictEqual(response.body.length, 2)
      const numbersOfComments = response.body.map(p => p.numberOfComments)
      console.log(numbersOfComments)
      assert(numbersOfComments.includes('3'))
      assert(numbersOfComments.includes('32'))

    })

    test.only('test get /api/posts/:id with query comments', async() => {

      const response = await api
        .get(`/api/posts/${postToComment.id}?comments=true`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // console.log(response.body)
      // const comments = response.body.comments
      // console.log(comments)
      // console.log(JSON.stringify(response.body))
      // console.log(response.body.comments.length)

      const post = response.body
      const comments = post.comments
      assert(comments)
      assert(comments.length === 3)
      assert(comments.every(c => c.id !== undefined))
      assert(comments.every(c => c.content !== undefined))
      assert(comments.every(c => c.likes !== undefined))
      assert(comments.every(c => c.createdAt !== undefined))
      assert(comments.every(c => c.updatedAt !== undefined))
      assert(comments.every(c => c.commenter !== undefined))
      assert(comments.every(c => c.commenter.username !== undefined))
    })

    test.only('test get /api/posts/:id without query comments', async() => {
      const response = await api
        .get(`/api/posts/${postToComment.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const post = response.body
      console.log(post)
      assert(post.comments === undefined)
    })

    test.only('test get /api/posts/:id/comments', async() => {
      const response = await api
        .get(`/api/posts/${postToComment.id}/comments`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const comments = response.body
      console.log(comments)
      assert.strictEqual(comments.length, 3)
      assert(comments.every(c => c.id !== undefined))
      assert(comments.every(c => c.content !== undefined))
      assert(comments.every(c => c.likes !== undefined))
      assert(comments.every(c => c.createdAt !== undefined))
      assert(comments.every(c => c.updatedAt !== undefined))
      assert(comments.every(c => c.commenter !== undefined))
      assert(comments.every(c => c.commenter.username !== undefined))
    })
  })
})

after(async () => {
  await Post.destroy({ where: {} })
  sequelize.close()
})