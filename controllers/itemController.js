const { Item, Note, Preview } = require('../models');
const { Op } = require('sequelize');
const { createSnapshot } = require('../utilities/snapshot');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const { deleteImage } = require('../utilities/uploadImg');
const { isURL } = require('../utilities/tools');

const repositionItem = async ({ refUuid }) => {
  const refNote = refUuid
    ? await Item.findOne({ where: { uuid: refUuid }, isDeleted: false })
    : null;
  const refId = refNote ? refNote.refId : null;

  let itemPosition = refId ? 'mid' : 'bot';
  const upperMost = await Item.max('refId');
  if (Number(refId) === Number(upperMost)) itemPosition = 'top';

  let subtractIds = 0;
  let upperId = 0;
  let newId = 0;

  switch (itemPosition) {
    case 'top':
      upperId = Math.floor(refId) + 1;
      subtractIds = upperId - refId;
      newId = Number(subtractIds) / 2 + Number(refId);
      break;
    case 'mid':
      upperId = await Item.min('refId', {
        where: { refId: { [Op.gt]: refId } },
        isDeleted: false,
      });
      subtractIds = upperId - refId;
      let divideNums = Number(subtractIds) / 2;
      newId = Number(divideNums) + Number(refId);
      break;
    case 'bot':
      upperId = await Item.min('refId');
      newId = Number(upperId) / 2;
      break;
    default:
      return { success: 0, message: 'Unable to move note to location' };
  }
  return { success: 1, newId };
};

// TODO fix this shit
exports.createItem = async (req, res, next) => {
  const { noteUuid, title, body, type, refUuid } = req.body;
  try {
    const note = await Note.findOne({ where: { uuid: noteUuid } });
    if (!note) return res.status(422).json({ message: 'Unable to find note' });

    const response = await repositionItem({ refUuid });
    if (!response.success) return res.status(422).json(response.message);
    const item = await Item.create({
      title,
      body,
      type,
      noteId: note.id,
      checked: 0,
      refId: response.newId,
      isDeleted: 0,
    });
    if (type === 'Bookmark') {
      const snapshot = await createSnapshot({ url: title });
      if (snapshot && snapshot.success) {
        // * save snapshot img on db as Buffer
        // const imgPath = './uploads/example.png';
        // const fileType = mime.getType(imgPath);
        // const fileName = path.parse(imgPath).name;
        // fs.readFile(imgPath, async (err, data) => {
        //   if (err) {
        //     throw err;
        //   }
        //   console.log('data', data);
        //   const itemTitle = snapshot.pageTitle ? snapshot.pageTitle : title;
        //   const itemDescription = snapshot.pageDescription
        //     ? snapshot.pageDescription
        //     : title;
        //   const params = {
        //     title: itemTitle.substring(0, 255),
        //     description: itemDescription.substring(0, 255),
        //     // type: fileType,
        //     type: snapshot.pageImage ? 'url' : fileType,
        //     image: '',
        //     // image: snapshot.pageImage ? '' : data,
        //     imageUrl: snapshot.pageImage ? snapshot.pageImage : '',
        //     itemId: item.id,
        //   };
        //   const preview = await Preview.create(params);
        //   return res.status(201).json({
        //     success: true,
        //     message: 'Successfully created',
        //     item: {
        //       ...item.dataValues,
        //       preview,
        //     },
        //   });
        // });
        // * save snapshot on cloud storage
        const itemDescription = snapshot.pageDescription
          ? snapshot.pageDescription
          : title;
        const itemTitle = snapshot.pageTitle ? snapshot.pageTitle : title;
        const params = {
          title: itemTitle.substring(0, 255),
          description: itemDescription.substring(0, 255),
          type: 'url',
          image: '',
          imageUrl: snapshot.pageImage,
          itemId: item.id,
        };
        await Preview.create(params);
        const newItem = await Item.findOne({
          where: { uuid: item.uuid },
          include: 'preview',
        });
        return res.status(201).json({
          success: true,
          message: 'Successfully created',
          item: newItem,
        });
      } else {
        return res
          .status(201)
          .json({ success: false, message: 'Unable to create snapshot', item });
      }
    } else if (type === 'Text') {
      res
        .status(201)
        .json({ success: true, message: 'Successfully created', item });
    } else {
      res.status(422).json({ success: false, message: 'Invalid item type' });
    }
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};
exports.getItems = async (req, res, next) => {
  try {
    const item = await Item.findAll({
      where: { isDeleted: false },
      include: 'note',
      order: [
        ['refId', 'ASC'],
        ['title', 'ASC'],
      ],
    });
    res.status(201).json(item);
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};
exports.getItemsByNoteId = async (req, res, next) => {
  const noteUuid = req.params.id;
  try {
    const note = await Note.findOne({ where: { uuid: noteUuid } });
    const item = await Item.findAll({
      where: { noteId: note.id, isDeleted: false },
      include: 'preview',
      order: [
        ['refId', 'ASC'],
        ['title', 'ASC'],
      ],
    });
    res.status(201).json(item);
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};
exports.updateItem = async (req, res, next) => {
  const uuid = req.params.uuid;
  const { title, body, type } = req.body;
  try {
    const item = await Item.findOne({ where: { uuid } });
    item.title = title;
    item.body = body;
    item.type = type;
    item.save();
    res
      .status(201)
      .json({ success: true, message: 'Item successfully updated', item });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};
exports.updateCheck = async (req, res, next) => {
  const uuid = req.params.uuid;
  try {
    const item = await Item.findOne({ where: { uuid } });
    item.checked = !item.checked;
    item.save();
    res
      .status(201)
      .json({ success: true, message: 'Item successfully updated', item });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

const checkCloudinaryImg = async (imgUrl) => {
  if (!isURL(imgUrl)) return null;
  const urlSplit = imgUrl.split('/');
  const idx = urlSplit.findIndex((el) => el === 'res.cloudinary.com');
  if (idx === -1) return null;
  const id = urlSplit.pop().split('.').slice(0, -1).join('.');
  return id;
};

exports.archiveItem = async (req, res, next) => {
  const uuid = req.params.uuid;
  try {
    const item = await Item.findOne({
      where: { uuid },
      include: 'preview',
      raw: true,
      nest: true,
    });
    await Item.update(
      { isDeleted: true },
      {
        where: { uuid },
      }
    );

    if (item.type === 'Bookmark') {
      const img = item?.preview?.imageUrl;
      const id = await checkCloudinaryImg(img);
      if (id) await deleteImage(id);
      console.log('Image successfully deleted');
    }
    res
      .status(201)
      .json({ success: true, message: 'Item successfully deleted', item });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.updateItemPosition = async (req, res, next) => {
  const { refUuid } = req.body;
  const uuid = req.params.uuid;
  try {
    const item = await Item.findOne({ where: { uuid } });
    if (!item) return res.status(422).json({ message: 'Unable to find item' });

    const response = await repositionItem({ refUuid });
    if (!response.success) return res.status(422).json(response.message);

    item.refId = response.newId;
    item.save();

    res
      .status(201)
      .json({ success: true, message: 'Successfully update', data: item });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};
