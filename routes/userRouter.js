const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth")

const {
  register,
  login,
  getAllUsers,
  updateUser,
  getUser,
  archiveUser,
  forgotPassword,
  changePassword,
} = require("../controllers/userController");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/edit").put(protect, updateUser);
router.route("/").get(protect, getUser);
router.route("/all").get(protect, getAllUsers);
router.route("/delete/:uuid").put(protect, archiveUser);
router.route("/forgotpassword").post(forgotPassword);
router.route("/changepassword/:id").put(changePassword);

module.exports = router;