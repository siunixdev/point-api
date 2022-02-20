const { verifySignUp } = require('../middlewares')
const controller = require('../controllers/auth.controller')
const res = require('express/lib/response')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    )
    next()
  })

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRole
    ],
    controller.signup
  )

  app.post(
    "/api/auth/signin",
    controller.signin
  )

  app.post(
    "/api/auth/sigout",
    controller.signout
  )
}