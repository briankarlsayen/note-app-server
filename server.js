const express = require('express');
const app = express();
const cors = require("cors")


const PORT = process.env.PORT || 5632
const { sequelize } = require('./models')

const { protect } = require("./middlewares/auth")
const itemRoutes = require('./routes/itemRouter')
const noteRoutes = require('./routes/noteRouter')
const previewRoutes = require('./routes/previewRouter')
const userRoutes = require('./routes/userRouter')


// const urlApp = process.env.URLAPP
// app.use(cors({ credentials: true, origin: urlApp }))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.json('Routes alive')
})

app.get('/protected', protect, (req, res) => {
  return res.status(200).json(req.jwt)
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