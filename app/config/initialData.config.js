const db = require("../models")

const Role = db.role

const initial = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.error("error", err);
        }

        console.log("Added 'user' to roles collection");
      })

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.error("error", err);
        }

        console.log("Added 'admin' to roles collection");
      })
    }
  })
}

module.exports = initial