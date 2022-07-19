// TODO reset password route

const { User, MailReceipt } = require('../models')
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");
const { sendEmail } = require('../utilities/sendEmail')

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, mobileNo, password, } = req.body;
  try {
    const emailExist = await User.findOne({ where: { email, isDeleted: false }})
    if(emailExist) return res.status(422).json({message: "Email already exist"})
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ firstName, lastName, email, mobileNo, password: hashedPassword });
    if(!user) return res.status(422).json({message: "Unable to create user"})
    const options = {
      to: email,
      subject: 'Successful registration',
      code: 'RC',
    }
    sendEmail(options)

    res.status(201).json({message: "Successfully created", user})
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.findAll({ where: { isDeleted: false }})
    res.status(201).json(user)
  } catch(error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.login = (req, res, next) => {
  if(req.isAuthenticated()) {

    return res.status(200).json({message: `Welcome ${req.user.firstName} ${req.user.lastName}`})
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

exports.updateUser = async(req, res, next) => {
  const { firstName, lastName, email, mobileNo, } = req.body;
  const { uuid } = req.user
  try {
    const emailExist = await User.findOne({ where: { uuid: { [Op.not]: uuid },email }})
    if(emailExist) return res.status(422).json({message: "Email already exist"})

    const user = await User.findOne({ where: { uuid }})
    if(!user) return res.status(422).json({ message: "Unable to find user"})
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.mobileNo = mobileNo;
    user.save()
    res.status(201).json(user)
  } catch (error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.getUser = async(req, res, next) => {
  return res.status(200).json(req.user)
}

exports.archiveUser = async(req, res, next) => {
  const { uuid } = req.params
  try {
    const user = await User.findOne({ where: { uuid, isDeleted: false }})
    if(!user) return res.status(422).json({ message: "Unable to find user"})
    user.isDeleted = true;
    user.save()
    res.status(201).json(user)
  } catch (error) {
    return res.status(422).json({message: "error: ", error})
  }
}

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  try {
    const options = {
      to: email,
      subject: 'Forgot password',
      code: 'FP',
    }
    sendEmail(options)
    res.status(200).json({message: "Mail successfully sent"}) 
  } catch (error) {
    console.log('catch', error)
    return res.status(422).json({message: "error: ", error})
  }
}

exports.changePassword = async(req, res, next) => {
  const { password, retyped } = req.body;
  const { id } = req.params
  try {
    const currentDate = new Date()
    const checkReceipt = await MailReceipt.findOne({ where: { msgId: id, expires: { [Op.gt]: currentDate }, isDeleted: false }})
    if(!checkReceipt) return res.status(422).json({message: "Your request has already expired, please make another request"})

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.findOne({where: { email: checkReceipt.to, isDeleted: false }})
    if(!user) return res.status(422).json({message: "Unable to find user"})
    user.password = hashedPassword;
    user.save()
    
    checkReceipt.isDeleted = true;
    checkReceipt.save()
    res.status(200).json({message: "Password successfully changed"}) 
  } catch (error) {
    console.log('catch', error)
    return res.status(422).json({message: "error: ", error})
  }
}

exports.loginFailed = async(req, res, next) => {
  try {
    // if(req.session.messages) {
    //   if(req.session.messages.length) return res.status(401).json({ message: req.session.messages.slice(-1).pop() })
    // }
    return res.status(401).json({message: "Invalid username or password"})
  } catch (error) {
    console.log('catch', error)
    return res.status(422).json({message: "error: ", error})
  }
}