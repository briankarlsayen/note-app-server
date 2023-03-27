const fs = require('fs');
require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: '123',
    database: 'note-db',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {},
  production: {
    dialect: 'postgres',
    url: '',
    // url: process.env.DATABASE_URL,
  },
};
