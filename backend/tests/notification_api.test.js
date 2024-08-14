const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const { connectToDatabase, sequelize } = require('../utils/db')
const { User, Notification } = require('../models')


beforeEach(async () => {
  await connectToDatabase()
  await User.destroy({ where: {} })
  await Notification.destroy({ where: {} })
})

describe('Notification API', () => {
  let adminToken, userToken
  beforeEach (async () => {
    Notification.destroy({ where: {} })
    const adminUser = {
      username: 'admin',
      password: 'adminpassword',
      role: 'admin'
    }
    const normalUser = {
      username: 'user',
      password: 'userpassword',
      role: 'user'
    }
    const adminResponse = await api
      .post('/api/users/pwd')
      .send(adminUser)
      .expect(201)

    const userResponse = await api
      .post('/api/users/pwd')
      .send(normalUser)
      .expect(201)

    const  adminUserId  = adminResponse.body.userId
    const  userId  = userResponse.body.userId

    adminToken = await helper.getToken(api, adminUser)
    userToken = await helper.getToken(api, normalUser)

    console.log('adminUserId', adminUserId)
    // exit()

    await Notification.bulkCreate(
      helper.initialNotifications.map(n => ({
        ...n,
        type: 'global',
        userId: adminUserId,
      }))
    )

    await Notification.bulkCreate(
      helper.initialNotifications.concat({
        message: 'forth notification'
      })
        .map(n => ({
          ...n,
          type: 'global',
          userId,
        }))
    )

    const notifications = await helper.notificationsInDb()
    assert.strictEqual(notifications.length, 7)

  })


  describe('GET /api/notifications', () => {
    test('returns all admin notifications', async () => {
      console.log('hey')
      const response = await api
        .get('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      console.log('Response received')
      // console.log(response)
      console.log('Response body:', response.body)
      assert.strictEqual(response.body.length, helper.initialNotifications.length)
      console.log('Assertion passed')
    })

    test('returns only user notifications', async () => {
      const response = await api
        .get('/api/notifications')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, helper.initialNotifications.length + 1)
    })

    test('returns 401 if token is not provided', async () => {
      await api
        .get('/api/notifications')
        .expect(401)
    })
  })

  describe('POST /api/notifications', () => {
    beforeEach(async () => {
      const newNormalUser = {
        username: 'newuser',
        password: 'newuserpassword',
        role: 'user'
      }
      await api
        .post('/api/users/pwd')
        .send(newNormalUser)
        .expect(201)
    })

    test('creates a new notification', async () => {
      const notificationsAtStart = await helper.notificationsInDb()
      const newNotification = {
        message: 'fifth notification'
      }

      const response = await api
        .post('/api/notifications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newNotification)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.message, newNotification.message)

      const notificationsAtEnd = await helper.notificationsInDb()
      const users = await helper.usersInDb()
      assert.strictEqual(notificationsAtEnd.length, notificationsAtStart.length + users.length)
    })

    test('returns 401 if token is not provided', async () => {
      await api
        .post('/api/notifications')
        .expect(401)
    })

    test('returns 403 if user is not admin', async () => {
      await api
        .post('/api/notifications')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403)
    })
  })

  describe('PUT /api/notifications/:id', () => {
    let userToken, userId
    beforeEach( async () => {
      Notification.destroy({ where: {} })
      const newNormalUser = {
        username: 'newuser',
        password: 'newuserpassword',
        role: 'user'
      }
      const userResponse = await api
        .post('/api/users/pwd')
        .send(newNormalUser)
        .expect(201)
      userId = userResponse.body.userId
      userToken = await helper.getToken(api, newNormalUser)
      await Promise.all(helper.initialNotifications.map(n =>
        Notification.create({
          ...n,
          type: 'global',
          userId,
        })
      ))
      assert.strictEqual((await helper.notificationsInDb()).length, helper.initialNotifications.length)
    })
    test('updates notification read status', async () => {
      const notifications = await helper.notificationsInDb()
      const notificationToUpdate = notifications[0]
      const updatedNotification = {
        read: true
      }
      const response = await api
        .put(`/api/notifications/${notificationToUpdate.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedNotification)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const notificationId = response.body.id
      assert.strictEqual(response.body.read, updatedNotification.read)
      const updatedNotificationInDb = await Notification.findByPk(notificationId)
      assert.strictEqual(updatedNotificationInDb.read, updatedNotification.read)
    })

    test('returns 403 if user is not allowed to update notification', async () => {
      const notifications = await helper.notificationsInDb()
      const notificationToUpdate = notifications[0]
      const updatedNotification = {
        read: true
      }
      await api
        .put(`/api/notifications/${notificationToUpdate.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedNotification)
        .expect(403)
    })

    test('returns 404 if notification is not found', async () => {
      const notificationId = await helper.nonExistingId()
      const updatedNotification = {
        read: true
      }
      await api
        .put(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedNotification)
        .expect(404)
    })

    test('return 403 if field other than read is changed', async () => {
      const notifications = await helper.notificationsInDb()
      const notificationToUpdate = notifications[0]
      const updatedNotification = {
        message: 'new message'
      }
      await api
        .put(`/api/notifications/${notificationToUpdate.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedNotification)
        .expect(403)
    })
  })

  describe('DELETE /api/notifications/:id', () => {
    let userToken, userId
    beforeEach( async () => {
      Notification.destroy({ where: {} })
      const newNormalUser = {
        username: 'newuser',
        password: 'newuserpassword',
        role: 'user'
      }
      const userResponse = await api
        .post('/api/users/pwd')
        .send(newNormalUser)
        .expect(201)
      userId = userResponse.body.userId
      userToken = await helper.getToken(api, newNormalUser)
      await Promise.all(helper.initialNotifications.map(n =>
        Notification.create({
          ...n,
          type: 'global',
          userId,
        })
      ))
      assert.strictEqual((await helper.notificationsInDb()).length, helper.initialNotifications.length)
    })
    test('deletes notification', async () => {
      const notifications = await helper.notificationsInDb()
      const notificationToDelete = notifications[0]
      await api
        .delete(`/api/notifications/${notificationToDelete.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)
      const notificationsAtEnd = await helper.notificationsInDb()
      assert.strictEqual(notificationsAtEnd.length, notifications.length - 1)
    })

    test('returns 403 if user is not allowed to delete notification', async () => {
      const notifications = await helper.notificationsInDb()
      const notificationToDelete = notifications[0]
      await api
        .delete(`/api/notifications/${notificationToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403)
    })
  })

})

/*
describe.only('create notifications when post /api/post', () => {
  let adminToken, userToken
  beforeEach(async () => {
    // create 3 admin users
    const adminUsers = [
      {
        username: 'admin1',
        password: 'adminpassword',
        role: 'admin'
      },
      {
        username: 'admin2',
        password: 'adminpassword',
        role: 'admin'
      },
      {
        username: 'admin3',
        password: 'adminpassword',
        role: 'admin'
      }
    ]

    // create 2 normal users
    const normalUsers = [
      {
        username: 'user1',
        password: 'userpassword',
        role: 'user'
      },
      {
        username: 'user2',
        password: 'userpassword',
        role: 'user'
      }
    ]

    // await api.post('/api/users/pwd')


    // 使用 Promise.all 等待所有用户创建完成
    const promiseArray = adminUsers.map(user =>
      api
        .post('/api/users/pwd')
        .send(user)
        .expect(201)
    )
    await Promise.all(promiseArray)
    await Promise.all(normalUsers.map(user =>
      api
        .post('/api/users/pwd')
        .send(user)
        .expect(201)
    ))

    const users = await helper.usersInDb()
    assert.strictEqual(users.length, 5)
    const adminLogin = await api
      .post('/api/login/pwd')
      .send(adminUsers[0])
      .expect(200)
    const userLogin = await api
      .post('/api/login/pwd')
      .send(normalUsers[0])
      .expect(200)

    adminToken = adminLogin.body.token
    userToken = userLogin.body.token
  })

  test('creates notifications when post is created', async () => {
    const notificationsAtStart = await helper.notificationsInDb()
    const newPost = {
      title: 'new post',
      content: 'content of new post'
    }
    await api
      .post('/api/posts')
      .send(newPost)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)
    const notificationsAtEnd = await helper.notificationsInDb()
    const users = await helper.usersInDb()
    const adminUsers = users.filter(u => u.role === 'admin')
    assert.strictEqual(notificationsAtEnd.length, notificationsAtStart.length + adminUsers.length)
    // console.log(notificationsAtEnd)
    const notificationUserIds = notificationsAtEnd.map(n => n.userId)
    assert(notificationUserIds.includes(adminUsers[0].id))
    assert(notificationUserIds.includes(adminUsers[1].id))
    assert(notificationUserIds.includes(adminUsers[2].id))
  })

  describe('creates notifications for when comment is created', () => {
    let postToComment
    beforeEach(async () => {
      const newPost = {
        title: 'new post',
        content: 'content of new post'
      }
      const postResponse = await api
        .post('/api/posts')
        .send(newPost)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)
      postToComment = postResponse.body
    })

    test('creates notifications for admin when user comments', async () => {
      const notificationsAtStart = await helper.notificationsInDb()
      const newComment = {
        content: 'new comment',
        postId: postToComment.id
      }
      await api
        .post(`/api/posts/${postToComment.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201)

      const notificationsAtEnd = await helper.notificationsInDb()

      const users = await helper.usersInDb()
      const adminUsers = users.filter(u => u.role === 'admin')
      assert.strictEqual(notificationsAtEnd.length, notificationsAtStart.length + adminUsers.length)
      const commentReplyNotification = notificationsAtEnd.filter(n => n.type === 'comment_reply')
      const notificationUserIds = commentReplyNotification.map(n => n.userId)
      assert(notificationUserIds.includes(adminUsers[0].id))
      assert(notificationUserIds.includes(adminUsers[1].id))
      assert(notificationUserIds.includes(adminUsers[2].id))
    })

    test('creates notifications for user when admin comments', async () => {
      const notificationsAtStart = await helper.notificationsInDb()
      const newComment = {
        content: 'new comment',
        postId: postToComment.id
      }
      await api
        .post(`/api/posts/${postToComment.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201)

      const notificationsAtEnd = await helper.notificationsInDb()

      const post = await api
        .get(`/api/posts/${postToComment.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(notificationsAtEnd.length, notificationsAtStart.length + 1)
      const notificationUserIds = notificationsAtEnd
        .filter(n => n.type === 'comment_reply')
        .map(n => n.userId)
      console.log(notificationUserIds, notificationsAtEnd, post.body.userId)
      assert(notificationUserIds.includes(postToComment.userId))

    })
  })
})
*/

after(async () => {
  // User.destroy({ where: {} })
  // Notification.destroy({ where: {} })
  await sequelize.close()
})