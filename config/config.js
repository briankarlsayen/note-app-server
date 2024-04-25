const fs = require("fs");
require("dotenv").config();
const pg = require("pg");

module.exports = {
  development: {
    username: "postgres",
    password: "123",
    database: "notedb",
    host: "127.0.0.1",
    dialect: "postgres",
    dialectModule: pg,
  },
  test: {},
  production: {
    dialect: "postgres",
    url: process.env.DB_URL, // postres url
    dialectModule: pg,
  },
};
