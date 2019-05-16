const express = require('express')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res) => {
    res.send('ok')
  })

module.exports = usersRouter