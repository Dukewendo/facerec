const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const cors = require("cors");
const knex = require("knex");
const { unstable_createPortal } = require("react-dom");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "Coding2025",
    database: "smart-brain",
  },
});

app.use(bodyParser.json());
app.use(cors());

//signin --> POST (request user info) = success/fail
app.post("/signin", (req, resp) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
          resp.json(user[0]);
          })
          .catch((err) => resp.status(400).json("unable to get user"));
      } else {
        resp.status(400).json("wrong credentials");
      }
    })
    .catch((err) => resp.status(400).json("wrong credentials"));
});

//register --> POST = new user object returned
app.post("/register", (req, resp) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  // A transaction
  db.transaction((trx) => {
    return trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            resp.json(user[0]);
          });
      })
      .then(trx.comit)
      .catch(trx.rollback);
  }).catch((err) =>
    resp
      .status(400)
      .json(
        "Sorry we are unable to register that user.. please try another name and email address"
      )
  );
});

//profile/:userId --> GET = returns user
app.get("/profile/:id", (req, resp) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        resp.json(user[0]);
      } else {
        resp.status(400).json("Not found");
      }
    })
    .catch((err) => resp.status(400).json("Error getting user"));
});

//image end point --> PUT --> returns updated count for user
app.put("/image", (req, resp) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      resp.json(entries[0]);
    })
    .catch((err) => resp.status(400).json("unable to get count"));
});

app.listen(3000, () => {
  console.log("app started- port 3000");
});
