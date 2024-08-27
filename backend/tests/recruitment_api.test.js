const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const helper = require('./test_helpers')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const { Recruitment, Job, User } = require('../models')
const { connectToDatabase, sequelize } = require('../utils/db')

beforeEach(async () => {
  await connectToDatabase()
  await Recruitment.destroy({ where: {} })
  await Job.destroy({ where: {} })
  await User.destroy({ where: {} })
  await Recruitment.bulkCreate(helper.initialRecruitments)
  const recruitments = await Recruitment.findAll()
  const recruitmentId = recruitments[0].id
  // console.log(helper.initialJobs.map(job => ({ ...job, recruitmentId})))
  await Job.bulkCreate(
    helper.initialJobs.map(job => ({ ...job, recruitmentId }))
  )
})

describe('Recruitment API', () => {
  describe('API works without token', () => {
    describe('GET /api/recruitments', () => {
      test('should return all recruitments', async () => {
        const response = await api
          .get('/api/recruitments')
          .expect(200)
          .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, helper.initialRecruitments.length)
        assert.strictEqual(response.body[0].jobs.length, helper.initialJobs.length)
        assert(response.body.every(recruitment => recruitment.createdAt && recruitment.updatedAt))
        assert(response.body.every(r => r.numberOfComments === '0'))
      })
    })

    describe('GET /api/recruitments/:id', () => {
      test('should return a recruitment', async () => {
        const recruitments = await helper.recruitmentsInDb()
        const recruitment = recruitments[0]
        const response = await api
          .get(`/api/recruitments/${recruitment.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.title, recruitment.title)
        assert.strictEqual(response.body.jobs.length, helper.initialJobs.length)
        assert(response.body.createdAt && response.body.updatedAt)
        console.log(response.body)
      })

      test('should return 404 if recruitment does not exist', async () => {
        const nonExistingId = '5f8f1f9f-2b7d-4b4e-8b1e-4e3b7b1b4b1b'
        const response = await api
          .get(`/api/recruitments/${nonExistingId}`)
          .expect(404)
      })
    })
  })

  describe('API works with token', () => {
    let userId, userToken
    beforeEach(async () => {
      const user = {
        username: 'test',
        password: 'testpassword',
        role: 'admin'
      }
      const createResponse = await helper.createUser(api, user)
      userId = createResponse.userId
      userToken = await helper.getToken(api, user)

    })

    describe('POST /api/recruitments', () => {

      test('should create a new recruitment', async () => {
        const recruitmentsAtStart = await helper.recruitmentsInDb()
        const newRecruitment = {
          title: 'new recruitment',
          name: 'new recruitment',
          intro: 'new recruitment',
          province: 'new recruitment',
          city: 'new recruitment',
          street: 'new recruitment',
          address: 'new recruitment',
          phone: 'new recruitment',
          district: 'new recruitment',
        }
        const response = await api
          .post('/api/recruitments')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newRecruitment)
          .expect(201)
          .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.title, newRecruitment.title)
        assert.strictEqual(response.body.content, newRecruitment.content)
        assert(response.body.createdAt && response.body.updatedAt)
        const recruitmentsAtEnd = await helper.recruitmentsInDb()
        assert.strictEqual(recruitmentsAtEnd.length, recruitmentsAtStart.length + 1)
      })

      test('should not create a new recruitment without token', async () => {
        const newRecruitment = {
          title: 'new recruitment',
          name: 'new recruitment',
          intro: 'new recruitment',
          province: 'new recruitment',
          city: 'new recruitment',
          street: 'new recruitment',
          address: 'new recruitment',
          phone: 'new recruitment',
          district: 'new recruitment',
        }
        await api
          .post('/api/recruitments')
          .send(newRecruitment)
          .expect(401)
      })

      test('should not create a new recruitment without title', async () => {
        const recruitmentsAtStart = await helper.recruitmentsInDb()
        const newRecruitment = {
          name: 'new recruitment',
          intro: 'new recruitment',
          province: 'new recruitment',
          city: 'new recruitment',
          street: 'new recruitment',
          address: 'new recruitment',
          phone: 'new recruitment',
          district: 'new recruitment',
        }
        await api
          .post('/api/recruitments')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newRecruitment)
          .expect(400)
        const recruitmentsAtEnd = await helper.recruitmentsInDb()
        assert.strictEqual(recruitmentsAtEnd.length, recruitmentsAtStart.length)
      })
    })

    describe('DELETE /api/recruitments/:id', () => {
      test('should delete a recruitment', async () => {
        const recruitmentsAtStart = await helper.recruitmentsInDb()
        const recruitment = recruitmentsAtStart[0]
        await api
          .delete(`/api/recruitments/${recruitment.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(204)
        const recruitmentsAtEnd = await helper.recruitmentsInDb()
        assert.strictEqual(recruitmentsAtEnd.length, recruitmentsAtStart.length - 1)
      })

      test('should not delete a recruitment without token', async () => {
        const recruitmentsAtStart = await helper.recruitmentsInDb()
        const recruitment = recruitmentsAtStart[0]
        await api
          .delete(`/api/recruitments/${recruitment.id}`)
          .expect(401)
        const recruitmentsAtEnd = await helper.recruitmentsInDb()
        assert.strictEqual(recruitmentsAtEnd.length, recruitmentsAtStart.length)
      })
    })

    describe('PUT /api/recruitments/:id', () => {
      test('should update a recruitment', async () => {
        const recruitmentsAtStart = await helper.recruitmentsInDb()
        const recruitment = recruitmentsAtStart[0]
        const updatedRecruitment = {
          title: 'updated recruitment',
          name: 'updated recruitment',
          intro: 'updated recruitment',
          province: 'updated recruitment',
          phone: 'updated recruitment',
          district: 'updated recruitment',
        }
        const response = await api
          .put(`/api/recruitments/${recruitment.id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updatedRecruitment)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.title, updatedRecruitment.title)
        assert.strictEqual(response.body.name, updatedRecruitment.name)
        assert.strictEqual(response.body.intro, updatedRecruitment.intro)
        assert.strictEqual(response.body.province, updatedRecruitment.province)
        assert.strictEqual(response.body.phone, updatedRecruitment.phone)
        assert.strictEqual(response.body.district, updatedRecruitment.district)
        const recruitmentsAtEnd = await helper.recruitmentsInDb()
        assert.strictEqual(recruitmentsAtEnd.length, recruitmentsAtStart.length)
      })
    })
  })
})

describe('Recruitment API with comments', () => {
  let userId, userToken
  let adminId, adminToken
  beforeEach(async () => {
    const user = {
      username: 'test',
      password: 'testpassword',
    }
    const admin = {
      username: 'admin',
      password: 'adminpassword',
      role: 'admin'
    }

    const createResponse = await helper.createUser(api, user)
    userId = createResponse.userId
    userToken = await helper.getToken(api, user)

    const adminCreateResponse = await helper.createUser(api, admin)
    adminId = adminCreateResponse.userId
    adminToken = await helper.getToken(api, admin)
  })

  describe('POST /api/recruitments/:id/comments', () => {
    test('should create a new comment', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const commentsAtStart = await recruitment.getComments()
      const newComment = {
        content: 'new comment'
      }
      const response = await api
        .post(`/api/recruitments/${recruitment.id}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newComment)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.content, newComment.content)
      const commentsAtEnd = await recruitment.getComments()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length + 1)
    })

    test('should not create a new comment without token', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const commentsAtStart = await recruitment.getComments()
      const newComment = {
        content: 'new comment'
      }
      await api
        .post(`/api/recruitments/${recruitment.id}/comments`)
        .send(newComment)
        .expect(401)
      const commentsAtEnd = await recruitment.getComments()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length)
    })

    test('should not create a new comment without content', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const commentsAtStart = await recruitment.getComments()
      const newComment = {}
      await api
        .post(`/api/recruitments/${recruitment.id}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newComment)
        .expect(400)
      const commentsAtEnd = await recruitment.getComments()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length)
    })
  })

  describe('GET /api/recruitments/:id/comments', () => {
    test('should return all comments of a recruitment', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      await recruitment.createComment({
        content: 'first comment',
        userId,
        commentableType: 'recruitment',
        commentableId: recruitment.id
      })
      const comments = await recruitment.getComments()
      const response = await api
        .get(`/api/recruitments/${recruitment.id}/comments`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        console.log(response.body)
      assert.strictEqual(response.body.length, comments.length)
    })

    test('should return 404 if recruitment does not exist', async () => {
      const nonExistingId = '5f8f1f9f-2b7d-4b4e-8b1e-4e3b7b1b4b1b'
      await api
        .get(`/api/recruitments/${nonExistingId}/comments`)
        .expect(404)
    })
  })

  describe('DELETE /api/recruitments/:id/comments/:commentId', () => {
    beforeEach(async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      await recruitment.createComment({
        content: 'first comment',
        userId,
        commentableType: 'recruitment',
        commentableId: recruitment.id
      })
    })

    test('should delete a comment', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      console.log(comment)
      const commentsAtStart = await recruitment.getComments()
      await api
        .delete(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204)
      const commentsAtEnd = await recruitment.getComments()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1)
    })

    test('should not delete a comment without token', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      const commentsAtStart = await recruitment.getComments()
      await api
        .delete(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .expect(401)
      const commentsAtEnd = await recruitment.getComments()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length)
    })

    test('should delete a comment by admin', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      const commentsAtStart = await recruitment.getComments()
      await api
        .delete(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)
      const commentsAtEnd = await recruitment.getComments()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length - 1)
    })

    test('should not delete a comment without permission', async () => {
      const user = {
        username: 'test2',
        password: 'testpassword'
      }
      const createResponse = await helper.createUser(api, user)
      const userToken = await helper.getToken(api, user)
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      const commentsAtStart = await recruitment.getComments()
      await api
        .delete(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403)
      const commentsAtEnd = await recruitment.getComments()
      assert.strictEqual(commentsAtEnd.length, commentsAtStart.length)
    })
  })

  describe('PUT /api/recruitments/:id/comments/:commentId', () => {
    beforeEach(async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      await recruitment.createComment({
        content: 'first comment',
        userId: adminId,
        commentableType: 'recruitment',
        commentableId: recruitment.id
      })
    })

    test('should update a comment', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      const updatedComment = {
        likes: 2,
      }
      const response = await api
        .put(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedComment)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.likes, updatedComment.likes)
    })

    test('should not update a comment without token', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      const updatedComment = {
        likes: 3,
      }
      await api
        .put(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .send(updatedComment)
        .expect(401)
    })

    test('should not update a comment without permission', async () => {
      const user = {
        username: 'test2',
        password: 'testpassword'
      }
      const createResponse = await helper.createUser(api, user)
      const userToken = await helper.getToken(api, user)
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      const updatedComment = {
        content: 'updated comment'
      }
      await api
        .put(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedComment)
        .expect(403)
    })

    test('should not update an invalid field', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const comments = await recruitment.getComments()
      const comment = comments[0]
      const updatedComment = {
        id: '5f8f1f9f-2b7d-4b4e-8b1e-4e3b7b1b4b1b',
        content: 'updated comment'
      }
      await api
        .put(`/api/recruitments/${recruitment.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedComment)
        .expect(403)
    })
  })
})


describe('Recruitment API with jobs', () => {
  let adminToken, adminId
  let userId, userToken
  beforeEach(async () => {
    await Recruitment.destroy({ where: {} })
    await Job.destroy({ where: {} })
    await Recruitment.bulkCreate(helper.initialRecruitments)
    const recruitments = await Recruitment.findAll()
    const recruitmentId = recruitments[0].id
    await Job.bulkCreate(
      helper.initialJobs.map(job => ({ ...job, recruitmentId }))
    )

    const user = {
      username: 'test',
      password: 'testpassword',
    }
    const admin = {
      username: 'admin',
      password: 'adminpassword',
      role: 'admin'
    }
    const createResponse = await helper.createUser(api, user)
    userId = createResponse.userId
    userToken = await helper.getToken(api, user)
    const adminCreateResponse = await helper.createUser(api, admin)
    adminId = adminCreateResponse.userId
    adminToken = await helper.getToken(api, admin)
  })

  describe('POST /api/recruitments/:id/jobs', () => {
    test('should create a new job', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobsAtStart = await recruitment.getJobs()
      const newJob = {
        'name': 'new job',
        'intro': 'new job',
        'lowerBound': 1,
        'upperBound': 2,
      }
      const response = await api
        .post(`/api/recruitments/${recruitment.id}/jobs`)
        .send(newJob)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.title, newJob.title)
      assert.strictEqual(response.body.content, newJob.content)
      assert(response.body.createdAt && response.body.updatedAt)
      const jobsAtEnd = await recruitment.getJobs()
      assert.strictEqual(jobsAtEnd.length, jobsAtStart.length + 1)
    })

    test('should not create a new job without title', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobsAtStart = await recruitment.getJobs()
      const newJob = {
        intro: 'new job',
        lowerBound: 1,
        upperBound: 2,
      }
      await api
        .post(`/api/recruitments/${recruitment.id}/jobs`)
        .send(newJob)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400)
      const jobsAtEnd = await recruitment.getJobs()
      assert.strictEqual(jobsAtEnd.length, jobsAtStart.length)
    })

    test('should not create a new job without token', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobsAtStart = await recruitment.getJobs()
      const newJob = {
        name: 'new job',
        intro: 'new job',
        lowerBound: 1,
        upperBound: 2,
      }
      await api
        .post(`/api/recruitments/${recruitment.id}/jobs`)
        .send(newJob)
        .expect(401)
      const jobsAtEnd = await recruitment.getJobs()
      assert.strictEqual(jobsAtEnd.length, jobsAtStart.length)
    })
  })

  describe('GET /api/recruitments/:id/jobs', () => {
    test('should return all jobs of a recruitment', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobs = await recruitment.getJobs()
      const response = await api
        .get(`/api/recruitments/${recruitment.id}/jobs`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.length, jobs.length)
    })

    test('should return 404 if recruitment does not exist', async () => {
      const nonExistingId = '5f8f1f9f-2b7d-4b4e-8b1e-4e3b7b1b4b1b'
      await api
        .get(`/api/recruitments/${nonExistingId}/jobs`)
        .expect(404)
    })
  })

  describe('DELETE /api/recruitments/:id/jobs/:jobId', () => {
    test('should delete a job', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobs = await recruitment.getJobs()
      const job = jobs[0]
      const jobsAtStart = await recruitment.getJobs()
      await api
        .delete(`/api/recruitments/${recruitment.id}/jobs/${job.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204)
      const jobsAtEnd = await recruitment.getJobs()
      assert.strictEqual(jobsAtEnd.length, jobsAtStart.length - 1)
    })

    test('should not delete a job without token', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobs = await recruitment.getJobs()
      const job = jobs[0]
      const jobsAtStart = await recruitment.getJobs()
      await api
        .delete(`/api/recruitments/${recruitment.id}/jobs/${job.id}`)
        .expect(401)
      const jobsAtEnd = await recruitment.getJobs()
      assert.strictEqual(jobsAtEnd.length, jobsAtStart.length)
    })

    test('should not delete a job without permission', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobs = await recruitment.getJobs()
      const job = jobs[0]
      const jobsAtStart = await recruitment.getJobs()
      await api
        .delete(`/api/recruitments/${recruitment.id}/jobs/${job.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403)
      const jobsAtEnd = await recruitment.getJobs()
      assert.strictEqual(jobsAtEnd.length, jobsAtStart.length)
    })
  })

  describe('PUT /api/recruitments/:id/jobs/:jobId', () => {
    test('should update a job', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobs = await recruitment.getJobs()
      const job = jobs[0]
      const updatedJob = {
        name: 'updated job',
        intro: 'updated job',
        lowerBound: 2,
        upperBound: 3,
      }
      const response = await api
        .put(`/api/recruitments/${recruitment.id}/jobs/${job.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedJob)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.strictEqual(response.body.name, updatedJob.name)
      assert.strictEqual(response.body.intro, updatedJob.intro)
      assert.strictEqual(response.body.lowerBound, updatedJob.lowerBound)
      assert.strictEqual(response.body.upperBound, updatedJob.upperBound)
    })

    test('should not update a job without token', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobs = await recruitment.getJobs()
      const job = jobs[0]
      const updatedJob = {
        name: 'updated job',
        intro: 'updated job',
        lowerBound: 2,
        upperBound: 3,
      }
      await api
        .put(`/api/recruitments/${recruitment.id}/jobs/${job.id}`)
        .send(updatedJob)
        .expect(401)
    })

    test('should not update a job without permission', async () => {
      const recruitments = await Recruitment.findAll()
      const recruitment = recruitments[0]
      const jobs = await recruitment.getJobs()
      const job = jobs[0]
      const updatedJob = {
        name: 'updated job',
        intro: 'updated job',
        lowerBound: 2,
        upperBound: 3,
      }
      await api
        .put(`/api/recruitments/${recruitment.id}/jobs/${job.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedJob)
        .expect(403)
    })

  })
})

after(async () => {
  await Recruitment.destroy({ where: {} })
  await Job.destroy({ where: {} })
  await sequelize.close()
})