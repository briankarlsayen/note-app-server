const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { errorHandler } = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 5632;
const { sequelize } = require('./models');

// const urlApp = process.env.URLAPP
// app.use(cors({ credentials: true, origin: urlApp }))
app.use(cors());
// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://note-app-client.web.app',
// ];

// // * middlewares
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           'The CORS policy for this site does not ' +
//           'allow access from the specified Origin.';
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

const { protect } = require('./middlewares/auth');
const itemRoutes = require('./routes/itemRouter');
const noteRoutes = require('./routes/noteRouter');
const previewRoutes = require('./routes/previewRouter');
const userRoutes = require('./routes/userRouter');
const { hashString } = require('./utilities/tools');

app.get('/', (req, res) => {
  res.json('Routes alive');
});

app.get('/encrypt', (req, res) => {
  try {
  } catch (err) {}
});

app.get('/decrypt', (req, res) => {
  try {
  } catch (err) {}
  res.json('Routes alive');
});

app.get('/protected', protect, (req, res) => {
  return res.status(200).json(req.jwt);
});

app.get('/hash', protect, (req, res) => {
  const { string } = req.body;
  const hash = hashString(string);
  return res.status(200).json(hash);
});

app.use('/notes', protect, noteRoutes);
app.use('/items', protect, itemRoutes);
app.use('/previews', protect, previewRoutes);
app.use('/users', userRoutes);

// * error handling middleware
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Listening to port ${PORT}`);
  await sequelize.authenticate();
  console.log('Connected to database');
});
