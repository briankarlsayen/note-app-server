const express = require('express');
const router = express.Router();

const {
  createItem,
  getItems,
  getItemsByNoteId,
  updateItem,
  updateCheck,
  archiveItem,
  updateItemPosition,
  encryptItem,
  decryptItem,
} = require('../controllers/itemController');

router.route('/').post(createItem);
router.route('/').get(getItems);
router.route('/getbynote/:id').get(getItemsByNoteId);
router.route('/edit/:uuid').put(updateItem);
router.route('/editcheck/:uuid').put(updateCheck);
router.route('/delete/:uuid').put(archiveItem);
router.route('/reposition/:uuid').put(updateItemPosition);

router.route('/encrypt').post(encryptItem);
router.route('/decrypt').post(decryptItem);

module.exports = router;
