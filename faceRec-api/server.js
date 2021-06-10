const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const cors = require("cors");
const knex = require("knex");
const { unstable_createPortal } = require("react-dom");
const register = require('./controllers/register');
const signin = require ('./controllers/signin');
const profile = require ('./controllers/profile');
const image = require ('./controllers/image');
const { Profiler } = require("react");


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
app.post("/signin", (req, resp) => {signin.handleSignin(req, resp, db, bcrypt)});

//register --> POST = new user object returned
app.post("/register", (req, resp) => {register.handleRegister(req, resp, db, bcrypt)});

//profile/:userId --> GET = returns user
app.get("/profile/:id", (req, resp) => { profile.handleProfileGet(req, resp, db)});

//image end point --> PUT --> returns updated count for user
app.put("/image", (req, resp) => {image.handleImage(req, resp, db)});
app.post("/imageurl", (req, resp) => {image.handleApiCall(req, resp)});



app.listen(3000, () => {
  console.log("app started- port 3000");
});