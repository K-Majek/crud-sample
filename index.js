if(!process.env.NODE_ENV === "production") require("dotenv").config();

const {SESSION_SECRET = "test", PORT = "3000", DOMAIN = "localhost" } = process.env;

const express = require("express");
const app = express();
const path = require("path")

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

//create test user if doesn't exists

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


app.use("/", require("./routes/router"));

module.exports = app;