const fs = require("fs");
require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "123",
    database: "notedb",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {},
  production: {
    dialect: "postgres",
    url: "postgresql://postgres:TFpVAwniOgaGalfVWimVhWqhnOJzGaFI@roundhouse.proxy.rlwy.net:43506/railway", // postres url
  },
};
