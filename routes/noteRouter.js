const express = require("express");
const router = express.Router();

const {
  createNote,
  getNotes,
  getSpecificNote,
  updateNote,
  archiveNote,
  updateNotePosition,
} = require("../controllers/noteController");

router.route("/").post(createNote);
router.route("/").get(getNotes);
router.route("/:uuid").get(getSpecificNote);
router.route("/edit/:uuid").put(updateNote);
router.route("/delete/:uuid").put(archiveNote);
router.route("/reposition/:uuid").put(updateNotePosition);

module.exports = router;