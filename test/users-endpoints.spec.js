const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeThingsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

      const requiredFields = ['user_name', 'password', 'full_name']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          password: 'test password',
          full_name: 'test full_name',
          nickname: 'test nickname'
        }

        it(`responds with 400 'Missing ${field} in request body' when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`
            })
        })
      })

      it(`responds with 400 'Password must be longer than 8 characters' when password is short`, () => {
        const userShortPass = {
          user_name: 'test user_name',
          password: '1234567',
          full_name: 'test full_name'
        }

        return supertest(app)
          .post('/api/users')
          .send(userShortPass)
          .expect(400, {
            error: `Password must be longer than 8 characters`
          })
      })

      it(`responds with 400 'Password should be less than 72 characters' when password is long`, () => {
        const userLongPass = {
          user_name: 'test user_name',
          password: '*'.repeat(73),
          full_name: 'test full_name'
        }

        return supertest(app)
          .post('/api/users')
          .send(userLongPass)
          .expect(400, { error: `Password should be less than 72 characters` })
      })

      it(`responds with 400 'Password must not start or end with empty space' when password starts with space`, () => {
        const userPassStartsWithSpace = {
          user_name: 'test_username',
          password: ' 11AAaa!!',
          full_name: 'test full_name'
        }

        return supertest(app)
          .post('/api/users')
          .send(userPassStartsWithSpace)
          .expect(400, {
            error: `Password must not start or end with empty space`
          })
      })

      it(`responds with 400 'Password must not start or end with empty space' when password ends with space`, () => {
        const userPassEndsWithSpace = {
          user_name: 'test_username',
          password: '11AAaa!! ',
          full_name: 'test full_name'
        }

        return supertest(app)
          .post('/api/users')
          .send(userPassEndsWithSpace)
          .expect(400, {
            error: `Password must not start or end with empty space`
          })
      })

      it(`responds with 400 'Password must contain 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character' when password not complex enough`, () => {
        const userPassNotComplex = {
          user_name: 'test user_name',
          password: '11AAaabb',
          full_name: 'test full_name'
        }

        return supertest(app)
          .post('/api/users')
          .send(userPassNotComplex)
          .expect(400, {
            error: `Password must contain 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character`
          })
      })
    })
  })
})
