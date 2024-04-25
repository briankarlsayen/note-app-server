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
    url: "postgresql://postgres:TFpVAwniOgaGalfVWimVhWqhnOJzGaFI@roundhouse.proxy.rlwy.net:43506/railway", // postres url
    dialectModule: pg,
  },
};
