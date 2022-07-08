const { Item, Note, Preview } = require('../models')
const { Op } = require("sequelize");
const { createSnapshot } = require("../utilities/snapshot")
const fs = require('fs');
const path =require('path');
const mime = require('mime');

exports.createItem = async (req, res, next) => {
  const { noteUuid, title, body, type, } = req.body;
  try {
    const note = await Note.findOne({ where: {uuid: noteUuid } })
    const countCol = await Item.count()
    const item = await Item.create({title, body, type, noteId: note.id, checked: 0, refId: countCol + 1, isDeleted: 0});
    if(type === "Bookmark") {
      const snapshot = await createSnapshot({ url: title })
      console.log('snapshot', snapshot)
      if(snapshot && snapshot.success) {
        const imgPath = './uploads/example.png'
        const fileType = mime.getType(imgPath); 
        const fileName = path.parse(imgPath).name;
        fs.readFile(imgPath, async(err, data)=>{
          if(err) {
            throw err;
          }
          console.log('data', data)
          const params = {
            title: snapshot.pageTitle ? snapshot.pageTitle : title, 
            description: snapshot.pageDescription ? snapshot.pageDescription : title, 
            // type: fileType, 
            type: snapshot.pageImage ? "url" : fileType, 
            image: snapshot.pageImage ? "" : data, 
            imageUrl: snapshot.pageImage ? snapshot.pageImage : "",
            itemId: item.id
          }
          const preview = await Preview.create(params);
          return res.status(201).json({message: "Successfully created", item: {
            ...item.dataValues,
            preview
          }})
        })
      } else {
        return res.status(201).json({message: "Unable to create snapshot", item})
      }
    } else if(type === "Text") {
      res.status(201).json({message: "Successfully created", item})
    } else {
      res.status(422).json({message: "Invalid item type"})
    }
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}
exports.getItems = async (req, res, next) => {
  try {
    const item = await Item.findAll({ where: {isDeleted: false}, include: 'note', 
    order: [
      ['refId', 'ASC'],
      ['title', 'ASC'],
    ]})
    res.status(201).json(item)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}
exports.getItemsByNoteId = async (req, res, next) => {
  const noteUuid = req.params.id
  try {
    const note = await Note.findOne({ where: {uuid: noteUuid } })
    const item = await Item.findAll({where: { noteId: note.id, isDeleted: false }, include: 'preview', 
      order: [
        ['refId', 'ASC'],
        ['title', 'ASC'],
    ]})
    res.status(201).json(item)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}
exports.updateItem = async (req, res, next) => {
  const uuid = req.params.uuid
  const { title, body, type } = req.body
  try {
    const item = await Item.findOne({ where: { uuid } })
    item.title = title;
    item.body = body;
    item.type = type;
    item.save()
    res.status(201).json({message: "Item successfully updated", item})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}
exports.updateCheck = async (req, res, next) => {
  const uuid = req.params.uuid
  try {
    const item = await Item.findOne({ where: { uuid } })
    item.checked = !item.checked;
    item.save()
    res.status(201).json({message: "Item successfully updated", item})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}
exports.archiveItem = async (req, res, next) => {
  const uuid = req.params.uuid
  try {
    const item = await Item.findOne({ where: { uuid } })
    item.isDeleted = true;
    item.save()
    res.status(201).json({message: "Item successfully deleted", item})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.updateItemPosition = async (req, res, next) => {
  const { refUuid } = req.body
  const uuid = req.params.uuid;
  try {
    const item = await Item.findOne({ where: { uuid }});
    if(!item) return res.status(422).json({message: "Unable to find item"})

    const refNote = refUuid ? await Item.findOne({ where: { uuid: refUuid }, isDeleted: false}) : null;
    const refId = refNote ? refNote.refId : null;
    
    let itemPosition = refId ? "mid" : "bot";
    const upperMost = await Item.max('refId')
    if(Number(refId) === Number(upperMost)) itemPosition = "top";

    let subtractIds = 0;
    let upperId = 0;
    let newId = 0;
    
    switch(itemPosition){
      case "top":
        upperId = Math.floor(refId) + 1;
        subtractIds = upperId - refId;
        newId = Number(subtractIds) / 2 + Number(refId);
        break;
      case "mid":
        upperId = await Item.min('refId', { where: { refId: { [Op.gt]: refId }, isDeleted: false}})
        subtractIds = upperId - refId;
        let divideNums = Number(subtractIds) / 2
        newId = Number(divideNums) + Number(refId);
        break;
      case "bot":
        upperId = await Item.min('refId')
        newId = Number(upperId) / 2;
        break;
      default: 
        return res.status(422).json({message: "Unable to move item to location"})
    }
   
    item.refId = newId;
    item.save();

    res.status(201).json({message: "Successfully update", data: item})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}