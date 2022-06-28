const express = require("express");
const router = express.Router();
const { uploadImage, uploadMemory } = require('../utilities/upload')

const {
  createPreviewByUpload,
  createPreviewBySnapshot,
  createSnapshotImage,
  createUploadImage,
  getPreviews,
  readImage,
  // getSpecificNote,
  // updateNote,
  // archiveNote,
} = require("../controllers/previewController");

router.route("/upload").post(uploadMemory, createUploadImage);
router.route("/snapshot").post(createSnapshotImage);
router.route("/dummy").post(readImage);
router.route("/upload/:uuid").post(uploadMemory, createPreviewByUpload);
router.route("/:uuid").post(uploadMemory, createPreviewBySnapshot);
router.route("/").get(getPreviews);
// router.route("/:uuid").get(getSpecificNote);
// router.route("/edit/:uuid").put(updateNote);
// router.route("/delete/:uuid").put(archiveNote);

module.exports = router;