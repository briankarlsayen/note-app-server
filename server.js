const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5632;
const { sequelize } = require("./models");

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { protect } = require("./middlewares/auth");
const itemRoutes = require("./routes/itemRouter");
const noteRoutes = require("./routes/noteRouter");
const previewRoutes = require("./routes/previewRouter");
const userRoutes = require("./routes/userRouter");

app.get("/", (req, res) => {
  res.json("Routes alive");
});

app.get("/protected", protect, (req, res) => {
  return res.status(200).json(req.jwt);
});

app.use("/notes", protect, noteRoutes);
app.use("/items", protect, itemRoutes);
app.use("/previews", protect, previewRoutes);
app.use("/users", userRoutes);

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Listening to port ${PORT}`);
  await sequelize.authenticate();
  console.log("Connected to database");
});
