const express = require('express');
const app = express();
const cors = require("cors")
const passport = require('passport')
const session = require('express-session');

const PORT = process.env.PORT || 5632
const { sequelize } = require('./models')

const { protect } = require("./middlewares/auth")
const itemRoutes = require('./routes/itemRouter')
const noteRoutes = require('./routes/noteRouter')
const previewRoutes = require('./routes/previewRouter')
const userRoutes = require('./routes/userRouter')

// * initialize passport
require('./config/passport-config')

// * init sequelize session
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const storeParams = new SequelizeStore({
  db: sequelize,
  tableName: "sessions",
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    store: storeParams,
    saveUninitialized: true,
    resave: false,
    proxy: true, 
    // * 1000 - msec to sec, 60 sec, 60 min, 24 hrs
    expiration: 24 * 60 * 60 * 1000,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  // if(req.session.visitCounter) {
  //   req.session.visitCounter ++
  // } else {
  //   req.session.visitCounter = 1
  // }
  // res.json(`This site has been accessed ${req.session.timesVisited} times`)
  res.json('Routes alive')
})

app.get('/protected', protect, (req, res) => {
  return res.status(200).json(req.user)
})

app.use('/notes', protect, noteRoutes)
app.use('/items', protect, itemRoutes)
app.use('/previews', protect, previewRoutes)
app.use('/users', userRoutes)

app.listen(PORT, async() => {
  console.log(`Listening to port ${PORT}`)
  await sequelize.authenticate();
  console.log('Connected to database')
})