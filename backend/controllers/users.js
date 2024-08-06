const bcrypt = require('bcrypt')
const User = require('../models/user')

const router = require('express').Router()

router.post('/', async (req, res) => {
  const { username, password, role } = req.body

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: `User validation failed:
         Path password is shorter 
         than the minimum allowed length (6)` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({ username, password:passwordHash, role })
  res.status(201).json(user)
})



router.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).end()
  }
  res.json(user)
})

module.exports = router


