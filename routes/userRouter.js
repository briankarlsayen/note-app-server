const express = require("express");
const router = express.Router();
const passport = require('passport')
const { protect } = require("../middlewares/auth")

const {
  register,
  login,
  getAllUsers,
  logout,
  updateUser,
  getUser,
  archiveUser,
  forgotPassword,
  changePassword,
  loginFailed,
} = require("../controllers/userController");

router.route("/register").post(register);
router.route("/login").post(passport.authenticate('local', {failureRedirect : '/users/loginfailed', failureMessage : true}), login);
router.route("/logout").post(protect, logout);
router.route("/edit").put(protect, updateUser);
router.route("/").get(protect, getUser);
router.route("/all").get(protect, getAllUsers);
router.route("/delete/:uuid").put(protect, archiveUser);
router.route("/forgotpassword").post(forgotPassword);
router.route("/changepassword/:id").put(changePassword);

router.route("/loginfailed").get(loginFailed);
router.route("/loginfailed").post(loginFailed);

module.exports = router;