const { User } = require('../models')
const bcrypt = require('bcrypt')
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, mobileNo, password, } = req.body;
  try {
    const emailExist = await User.findOne({ where: { email }})
    if(emailExist) return res.status(422).json({message: "Email already exist"})
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ firstName, lastName, email, mobileNo, password: hashedPassword });
    res.status(201).json({message: "Successfully created", user})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.findAll()
    res.status(201).json(user)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.login = async (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.status(200).json({message: "Login successfully"})
  } 
  return res.status(422).json({message: "Login failed"})
}

exports.logout = (req, res, next) => {
  try {
    req.session.destroy()
    res.status(200).json({message: "Successfully logout"})
  } catch (error) {
    return res.status(422).json({message: "error: ", error})
  }
}