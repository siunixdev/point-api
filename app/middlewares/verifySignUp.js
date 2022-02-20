const db = require('../models')
const ROLES = db.ROLES
const User = db.user

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({
          message: err
        })
      }

      if (user) {
        return res.status(400).send({
          message: "Username is already in use!"
        })
      }

      // check duplicate email
      User.findOne({
        email: req.body.email
      })
        .exec((err, user) => {
          if (err) {
            return res.status(500).send({
              message: err
            })
          }

          if (user) {
            return res.status(400).send({
              message: "Email is already in use!"
            })
          }

          next()
        })
    })
}

checkRole = (req, res, next) => {
  if (req.body.roles) {
    for (let index = 0; index < req.body.roles.length; index++) {
      if (!ROLES.includes(req.body.roles[index])) {
        return res.status.send({
          message: `Role ${req.body.roles[index]} doesn't exist`
        })
      }
    }
  }

  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRole
}

module.exports = verifySignUp