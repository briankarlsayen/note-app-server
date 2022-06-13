const express = require('express');
const app = express();
const cors = require("cors")
require("dotenv").config();
const PORT = process.env.PORT || 5632
const { sequelize, Note, Item } = require('./models')

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Routes alive')
})

app.post('/notes', async(req, res) => {
  const { title, description, body } = req.body;
  try {
    const note = await Note.create({title, description, body});
    res.status(201).json({message: "Successfully created", note})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.get('/notes', async(req, res) => {
  try {
    const note = await Note.findAll({ where: { isDeleted: false }, 
    order: [
      ['id', 'ASC'],
      ['title', 'ASC'],
    ]});
    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.get('/notes/:uuid', async(req, res) => {
  const uuid = req.params.uuid
  try {
    const note = await Note.findOne({ where: { uuid }, include: 'items'});
    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/notes/edit/:uuid', async(req, res) => {
  const uuid = req.params.uuid;
  console.log('uuid', uuid)
  const { title, description, body } = req.body;
  try {
    const note = await Note.findOne({ where: { uuid }});

    note.title = title;
    note.description = description;
    note.body = body;
    
    note.save()

    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/notes/delete/:uuid', async(req, res) => {
  const uuid = req.params.uuid;
  try {
    const note = await Note.findOne({ where: { uuid }});
    note.isDeleted = true;
    note.save();
    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.post('/items', async(req, res) => {
  const { noteUuid, title, body, type, } = req.body;
  try {
    const note = await Note.findOne({ where: {uuid: noteUuid } })
    const item = await Item.create({title, body, type, noteId: note.id, checked: 0, isDeleted: 0});
    res.status(201).json({message: "Successfully created", item})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.get('/items', async(req, res) => {
  try {
    const item = await Item.findAll({ where: {isDeleted: false}, include: 'note', 
    order: [
      ['id', 'ASC'],
      ['title', 'ASC'],
    ]})
    res.status(201).json(item)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/items/delete/:uuid', async(req, res) => {
  const uuid = req.params.uuid
  try {
    const item = await Item.findOne({ where: { uuid } })
    item.isDeleted = true;
    item.save()
    res.status(201).json({message: "Item successfully deleted", item})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/items/edit/:uuid', async(req, res) => {
  const uuid = req.params.uuid
  const { title, body, type } = req.body
  try {
    const item = await Item.findOne({ where: { uuid } })
    item.title = title;
    item.body = body;
    item.type = type;
    item.save()
    res.status(201).json({message: "Item successfully updated", item})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/items/editcheck/:uuid', async(req, res) => {
  const uuid = req.params.uuid
  try {
    const item = await Item.findOne({ where: { uuid } })
    item.check = !item.check;
    item.save()
    res.status(201).json({message: "Item successfully updated", item})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.get('/items/getbynote/:id', async(req, res) => {
  const noteUuid = req.params.id
  try {
    const note = await Note.findOne({ where: {uuid: noteUuid } })
    const item = await Item.findAll({where: { noteId: note.id, isDeleted: false }})
    res.status(201).json(item)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.listen(PORT, async() => {
  console.log(`Listening to port ${PORT}`)
  await sequelize.authenticate();
  console.log('Connected to database')
})