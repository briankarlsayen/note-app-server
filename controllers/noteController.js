const { Item, Note } = require('../models')
const { Op } = require("sequelize");

exports.createNote = async (req, res, next) => {
  const { title, description, body } = req.body;
  try {
    const countNote = await Note.count()
    const note = await Note.create({ title, description, body, refId: countNote + 1 });
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
  const { refUuid } = req.body
  const uuid = req.params.uuid;
  try {
    const note = await Note.findOne({ where: { uuid }});
    if(!note) return res.status(422).json({message: "Unable to find note"})

    const refNote = refUuid ? await Note.findOne({ where: { uuid: refUuid }, isDeleted: false}) : null;
    const refId = refNote ? refNote.refId : null;

    let notePosition = refId ? "mid" : "bot";
    const upperMost = await Note.max('refId')
    if(Number(refId) === Number(upperMost)) notePosition = "top";

    let subtractIds = 0;
    let upperNote = 0;
    let newId = 0;

    switch(notePosition){
      case "top":
        upperNote = Math.floor(refId) + 1;
        subtractIds = upperNote - refId;
        newId = Number(subtractIds) / 2 + Number(refId);
        break;
      case "mid":
        upperNote = await Note.min('refId', { where: { refId: { [Op.gt]: refId }, isDeleted: false}})
        subtractIds = upperNote - refId;
        let divideNums = Number(subtractIds) / 2
        newId = Number(divideNums) + Number(refId);
        break;
      case "bot":
        upperNote = await Note.min('refId')
        newId = Number(upperNote) / 2;
        break;
      default: 
        return res.status(422).json({message: "Unable to move note to location"})
    }
    
    note.refId = newId;
    note.save();

    res.status(201).json({message: "Successfully update", data: note})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}