const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter.post('/', jsonBodyParser, (req, res) => {
  const { password } = req.body

  for (const field of ['full_name', 'user_name', 'password']) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      })
    }
  }

  const passwordError = UsersService.validatePassword(password)
  if (passwordError) {
    return res.status(400).json({ error: passwordError })
  }

  res.send('ok')
})

module.exports = usersRouter
