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
npm run install
```
- generate secret keys, save the generated secret key to your .env file
```
node generateKeyPair.js
```
- apply migration
```
npx sequelize db:migrate
```

### frontend
note app frontend - [link](https://github.com/briankarlsayen/note-app-client)

### heroku deployment
- install heroku postgres addon
- puppeteer installation
https://stackoverflow.com/questions/52225461/puppeteer-unable-to-run-on-heroku
