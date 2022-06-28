const express = require('express');
const app = express();
const cors = require("cors")
require("dotenv").config();
const PORT = process.env.PORT || 5632
const { sequelize } = require('./models')

const itemRoutes = require('./routes/itemRouter')
const noteRoutes = require('./routes/noteRouter')
const previewRoutes = require('./routes/previewRouter')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
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