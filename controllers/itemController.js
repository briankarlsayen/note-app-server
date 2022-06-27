const { Item, Note } = require('../models')

exports.createItem = async (req, res, next) => {
  const { noteUuid, title, body, type, } = req.body;
  try {
    const note = await Note.findOne({ where: {uuid: noteUuid } })
    const item = await Item.create({title, body, type, noteId: note.id, checked: 0, isDeleted: 0});
    res.status(201).json({message: "Successfully created", item})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}
exports.getItems = async (req, res, next) => {
  try {
    const item = await Item.findAll({ where: {isDeleted: false}, include: 'note', 
    order: [
      ['id', 'ASC'],
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
    const item = await Item.findAll({where: { noteId: note.id, isDeleted: false }, 
      order: [
        ['id', 'ASC'],
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