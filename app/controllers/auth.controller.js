const config = require('../config/auth.config')
const db = require('../models')
const User = db.user
const Role = db.role
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  })

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: err
      })
      return
    }

    if (req.body.roles) {
      Role.find({
        name: { $in: req.body.roles }
      }, (err, roles) => {
        if (err) {
          return res.status(500).send({
            message: err
          })
        }
        user.roles = roles.map((role) => role._id)
        user.save((err) => {
          if (err) {
            return res.status(500).send({
              message: err
            })
          }

          res.send({
            message: "User registered Successfully!"
          })
        })
      }
      )
    } else {
      Role.findOne({
        name: "user"
      }, (err, role) => {
        if (err) {
          return res.status(500).send({
            message: err
          })
        }

        user.roles = [role._id]
        user.save((err) => {
          if (err) {
            return res.status(500).send({
              message: err
            })
          }

          res.send({
            message: "User registered Successfully!"
          })
        })
      })
    }
  })
}

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({
          message: err
        })
      }

      if (!user) {
        return res.status(404).send({
          message: "User not found!"
        })
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!"
        })
      }

      var token = jwt.sign({
        id: user._id
      }, config.secret, {
        expiresIn: 3600 * 24 // Expire in 24 Jam
      })

      var authorities = []
      for (let index = 0; index < user.roles.length; index++) {
        authorities.push("ROLE_" + user.roles[index].name.toUpperCase())
      }
      req.session.token = token
      res.status(200).send({
        username: user.username,
        email: user.email,
        roles: authorities,
        token: token
      })
    })
}

exports.signout = async (req, res) => {
  try {
    req.session = null
    return res.status(200).send({
      message: "You've been signed out!"
    })
  } catch (err) {
    this.next(err)
  }
}