const { Preview, Item } = require('../models')
const { createSnapshot } = require("../utilities/snapshot")
const fs = require('fs');
const path =require('path');
const mime = require('mime');

exports.createUploadImage = async(req, res, next) => {
  try {
    if(!req.file) return res.status(422).json({message: "File required"})
    res.status(200).json(req.file)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.createSnapshotImage = async(req, res, next) => {
  const { url } = req.body
  try {
    const snapshot = await createSnapshot({ url })
    res.status(200).json({message: "Sucessfully create", snapshot})
    // if(!req.file) return res.status(422).json({message: "File required"})
    // res.status(200).json(req.file)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.createPreviewByUpload = async (req, res, next) => {
  // const { title, description, type, image, } = req.body;
  const itemUuid = req.params.uuid
  const { originalname, mimetype, buffer, } = req.file;
  // const { description, } = req.body;
  try {
    const item = await Item.findOne({ where: {uuid: itemUuid } })
    console.log(item)
    const params = {
      title: originalname, description: "yeah", type: mimetype, image: buffer, itemId: item.id
    }
    // return res.json(params)
    const preview = await Preview.create(params);
    res.status(201).json({message: "Successfully created", preview})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.createPreviewBySnapshot = async (req, res, next) => {
  const itemUuid = req.params.uuid;
  const { url } = req.body
  try {
    const item = await Item.findOne({ where: {uuid: itemUuid } })
    const snapshot = await createSnapshot({ url })
    if(snapshot && snapshot.success) {
      const imgPath = './uploads/example.png'
      const fileType = mime.getType(imgPath); 
      const fileName = path.parse(imgPath).name;
      let data;
      fs.readFile(imgPath, async(err, data)=>{
        if(err) {
          throw err;
        }
        data = data;
        
      })
      if(data) {
        const params = {
          title: fileName, description: "yeah", type: fileType, image: data, itemId: item.id
        }
        const preview = await Preview.create(params);
        return res.status(201).json({message: "Successfully created", preview})
      }
      
    }
    
    return res.status(422).json({message: "Unable to create snapshot"})
    
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.getPreviews = async (req, res, next) => {
  try {
    console.log('hhaa')
    const previews = await Preview.findAll({
      order: [
        ['id', 'ASC'],
        ['title', 'ASC'],
      ]});
    res.status(201).json(previews)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.readImage = async(req, res, next) => {
  try {
    const imgPath = './uploads/example.png'
    const fileType = mime.getType(imgPath);   
    const fileName = path.parse(imgPath).name;
    fs.readFile(imgPath, (err, data)=>{
      if(err) {
        throw err;
      }
      const newData = {
        fileType,
        fileName,
        buffer: data
      }
      res.json(newData)
    })
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}