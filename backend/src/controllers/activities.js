const express = require('express')
const { Activity, Participate } = require('../models')
// ...existing code...

const router = express.Router()

// Get all activities
router.get('/activities', async (req, res) => {
  const activities = await Activity.findAll()
  res.json(activities)
})

// Get activity by ID
router.get('/activities/:id', async (req, res) => {
  const activity = await Activity.findByPk(req.params.id)
  if (activity) {
    res.json(activity)
  } else {
    res.status(404).json({ error: 'Activity not found' })
  }
})

// Create a new activity
router.post('/activities', async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Only admins can create activities' })
  }
  const activity = await Activity.create(req.body)
  res.status(201).json(activity)
})

// Create association between user and activity
router.post('/activities/:id/participate', async (req, res) => {
  const activity = await Activity.findByPk(req.params.id)
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' })
  }
  await Participate.create({
    userId: req.user.id,
    activityId: activity.id,
    status: 'pending',
  })
  res.status(201).json({ message: 'Participation requested' })
})

// Delete association between user and activity
router.delete('/activities/:id/participate', async (req, res) => {
  const participation = await Participate.findOne({
    where: {
      userId: req.user.id,
      activityId: req.params.id,
    },
  })
  if (participation) {
    await participation.destroy()
    res.json({ message: 'Participation cancelled' })
  } else {
    res.status(404).json({ error: 'Participation not found' })
  }
})

// Modify an activity
router.put('/activities/:id', async (req, res) => {
  const activity = await Activity.findByPk(req.params.id)
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' })
  }

  const isAdmin = req.user && req.user.isAdmin
  const allowedFields = ['views', 'likes']
  const adminFields = ['title', 'content', 'status', 'cover']

  const updateData = {}

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field]
    }
  })

  if (isAdmin) {
    adminFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field]
      }
    })
  } else {
    const forbiddenFields = adminFields.filter(field => req.body[field] !== undefined)
    if (forbiddenFields.length > 0) {
      return res.status(403).json({ error: 'Only admins can modify these fields' })
    }
  }

  await activity.update(updateData)
  res.json(activity)
})

// Delete an activity
router.delete('/activities/:id', async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Only admins can delete activities' })
  }
  const activity = await Activity.findByPk(req.params.id)
  if (activity) {
    await activity.destroy()
    res.json({ message: 'Activity deleted' })
  } else {
    res.status(404).json({ error: 'Activity not found' })
  }
})

// ...existing code...

module.exports = router
