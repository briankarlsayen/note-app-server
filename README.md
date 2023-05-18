# Note app server

A restful api for [note-app-client](https://github.com/briankarlsayen/note-app-client).

## Technologies

- expressjs
- sequelize
- postgres
- puppeteer

## Getting started

- install dependecies

```
npm install
```

- generate secret keys, save the generated secret key(PUB_KEY, PRIV_KEY) to your .env file

```
node generateKeyPair.js
```

- create database

```
npx sequelize db:create
```

- apply migration

```
npx sequelize db:migrate
```

### frontend

note app frontend - [link](https://github.com/briankarlsayen/note-app-client)

### heroku deployment

- install heroku postgres addon
