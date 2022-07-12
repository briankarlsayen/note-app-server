const express = require('express');
const app = express();
const cors = require("cors")
const passport = require('passport')
require("dotenv").config();
const PORT = process.env.PORT || 5632
const { sequelize } = require('./models')

const itemRoutes = require('./routes/itemRouter')
const noteRoutes = require('./routes/noteRouter')
const previewRoutes = require('./routes/previewRouter')

// * initialize passport
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('Routes alive')
})

app.use('/notes', noteRoutes)
app.use('/items', itemRoutes)
app.use('/previews', previewRoutes)

app.listen(PORT, async() => {
  console.log(`Listening to port ${PORT}`)
  await sequelize.authenticate();
  console.log('Connected to database')
})