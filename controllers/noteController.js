const { Item, Note } = require('../models')
const { Op } = require("sequelize");

const repositionNote = async({ refUuid }) => {
  const refNote = refUuid ? await Note.findOne({ where: { uuid: refUuid }, isDeleted: false}) : null;
  const refId = refNote ? refNote.refId : null;

  let notePosition = refId ? "mid" : "bot";
    const upperMost = await Note.max('refId')
    if(Number(refId) === Number(upperMost)) notePosition = "top";

    let subtractIds = 0;
    let upperId = 0;
    let newId = 0;

    switch(notePosition){
      case "top":
        upperId = Math.floor(refId) + 1;
        subtractIds = upperId - refId;
        newId = Number(subtractIds) / 2 + Number(refId);
        break;
      case "mid":
        upperId = await Note.min('refId', { where: { refId: { [Op.gt]: refId }}, isDeleted: false})
        subtractIds = upperId - refId;
        console.log('refId', refId)
        console.log('upperId', upperId)
        let divideNums = Number(subtractIds) / 2
        newId = Number(divideNums) + Number(refId);
        break;
      case "bot":
        upperId = await Note.min('refId')
        newId = Number(upperId) / 2;
        break;
      default: 
        return { success: 0, message: "Unable to move note to location" }
    }
    return { success: 1, newId };
}


exports.createNote = async (req, res, next) => {
  const { title, description, body, refUuid } = req.body;
  try {

    const response = await repositionNote({ refUuid })
    if(!response.success) return res.status(422).json(response.message)

    const note = await Note.create({ title, description, body, refId: response.newId });
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

    const response = await repositionNote({ refUuid })
    if(!response.success) return res.status(422).json(response.message)
    
    note.refId = response.newId;
    note.save();

    res.status(201).json({message: "Successfully update", data: note})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}