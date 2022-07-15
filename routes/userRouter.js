const express = require("express");
const router = express.Router();
// const { validateUser } = require('../config/passport-config')
const passport = require('passport')

const {
  register,
  login,
  getAllUsers,
  logout,
} = require("../controllers/userController");

router.route("/register").post(register);
router.route("/login").post( passport.authenticate('local', {failureRedirect : '/loginfailed', failureMessage : true}), login);
router.route("/logout").post(logout);
router.route("/").get(getAllUsers);

module.exports = router;