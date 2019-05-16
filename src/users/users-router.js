const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { password, user_name } = req.body

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

  UsersService.hasUserWithUserName(
    req.app.get('db'),
    user_name
  )
    .then(hasUserWithUserName => {
      if (hasUserWithUserName) {
        return res.status(400).json({ error: `Username is already taken` })
      }

      res.send('ok')
    })
    .catch(next)
})

module.exports = usersRouter
