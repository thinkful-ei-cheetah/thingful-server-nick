const express = require('express')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter.post('/', jsonBodyParser, (req, res) => {
  for (const field of ['full_name', 'user_name', 'password']) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      })
    }
  }

  res.send('ok')
})

module.exports = usersRouter
