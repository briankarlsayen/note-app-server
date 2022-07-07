const { Item, Note } = require('../models')
const { Op } = require("sequelize");

exports.createNote = async (req, res, next) => {
  const { title, description, body } = req.body;
  try {
    const countNote = await Note.count()
    // return res.json(countNote)
    const note = await Note.create({ title, description, body, refId: countNote });
    res.status(201).json({message: "Successfully created", note})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.getNotes = async (req, res, next) => {
  try {
    const note = await Note.findAll({ where: { isDeleted: false },
      order: [
        ['refId', 'ASC'],
        ['title', 'ASC'],
      ]});
    res.status(201).json(note)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.getSpecificNote = async (req, res, next) => {
  const uuid = req.params.uuid
  try {
    const note = await Note.findOne({ where: { uuid }, include: 'items'});
    if(!note) return res.status(422).json({message: "Unable to find note"})
    res.status(201).json(note)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.updateNote = async (req, res, next) => {
  const uuid = req.params.uuid;
  const { title, description, body } = req.body;
  try {
    const note = await Note.findOne({ where: { uuid }});
    if(!note) return res.status(422).json({message: "Unable to find note"})
    note.title = title;
    note.description = description;
    note.body = body;
    note.save()
    res.status(201).json(note)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.archiveNote = async (req, res, next) => {
  const uuid = req.params.uuid;
  try {
    const note = await Note.findOne({ where: { uuid }});
    if(!note) return res.status(422).json({message: "Unable to find note"})
    note.isDeleted = true;
    note.save();
    res.status(201).json(note)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.updateNotePosition = async (req, res, next) => {
  const { refId } = req.body
  const uuid = req.params.uuid;
  try {
    const note = await Note.findOne({ where: { uuid }});
    if(!note) return res.status(422).json({message: "Unable to find note"})
    const upperNote = await Note.min('refId', { where: { refId: { [Op.gt]: refId }, isDeleted: false}});
    if(!upperNote) return res.status(422).json({message: "Unable to move note to location"})

    let subtractIds = upperNote - refId;
    let newId = subtractIds < 1 ? subtractIds / 2 + refId : 0.5 + refId;
    // return res.json(uuid)
    note.refId = newId;
    note.save();

    res.status(201).json({message: "Successfully update", data: note})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}