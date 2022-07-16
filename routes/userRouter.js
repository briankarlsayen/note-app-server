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
} = require("../controllers/userController");

router.route("/register").post(register);
router.route("/login").post(passport.authenticate('local', {failureRedirect : '/loginfailed', failureMessage : true}), login);
router.route("/logout").post(protect, logout);
router.route("/edit").put(protect, updateUser);
router.route("/").get(protect, getUser);
router.route("/all").get(protect, getAllUsers);
router.route("/delete/:uuid").put(protect, archiveUser);
router.route("/forgotpassword").post(forgotPassword);

module.exports = router;