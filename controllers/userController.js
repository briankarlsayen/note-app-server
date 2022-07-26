const { User, MailReceipt } = require('../models')
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");
const { sendEmail } = require('../utilities/sendEmail')
const { issueJWT } = require('../middlewares/auth')

const validatePassword = async(password, dbPassword) => {
  return bcrypt.compare(password, dbPassword)
}

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

exports.login = async(req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: username }}) 
    if (!user) return res.status(422).json({success: false, message: "Invalid user"})

    if (await validatePassword(password, user.password)) {
      const tokenObject = issueJWT(user);
      return res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
    } else {
      return res.status(422).json({success: false, message: "Login failed"})
    }

  } catch(error) {
    return res.status(422).json({success: false, message: "error: ", error})
  }
}

exports.updateUser = async(req, res, next) => {
  const { firstName, lastName, email, mobileNo, } = req.body;
  const uuid = req.jwt.sub
  try {
    const emailExist = await User.findOne({ where: { uuid: { [Op.not]: uuid },email }})
    if(emailExist) return res.status(422).json({message: "Email already exist"})

    const user = await User.findOne({ where: { uuid }})
    if(!user) return res.status(422).json({ success: false, message: "Unable to find user"})
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.mobileNo = mobileNo;
    user.save()
    res.status(201).json(user)
  } catch (error) {
    return res.status(422).json({success: false, message: "error: ", error})
  }
}

exports.getUser = async(req, res, next) => {
  const uuid = req.jwt.sub
  try {
    const user = await User.findOne({ where: { uuid, isDeleted: false }})
    return res.status(200).json(user)
  } catch(error) {
    return res.status(422).json({success: false, message: "error: ", error})
  }
}

exports.archiveUser = async(req, res, next) => {
  const { uuid } = req.params
  try {
    const user = await User.findOne({ where: { uuid, isDeleted: false }})
    if(!user) return res.status(422).json({ success: false, message: "Unable to find user"})
    user.isDeleted = true;
    user.save()
    res.status(201).json(user)
  } catch (error) {
    return res.status(422).json({ success: false, message: "error: ", error})
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
    res.status(200).json({ success: true, message: "Mail successfully sent"}) 
  } catch (error) {
    console.log('catch', error)
    return res.status(422).json({ success: false, message: "error: ", error})
  }
}

exports.changePassword = async(req, res, next) => {
  const { password, retyped } = req.body;
  const { id } = req.params
  try {
    const currentDate = new Date()
    const checkReceipt = await MailReceipt.findOne({ where: { msgId: id, expires: { [Op.gt]: currentDate }, isDeleted: false }})
    if(!checkReceipt) return res.status(422).json({ success: false, message: "Your request has already expired, please make another request"})

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.findOne({where: { email: checkReceipt.to, isDeleted: false }})
    if(!user) return res.status(422).json({ success: false, message: "Unable to find user"})
    user.password = hashedPassword;
    user.save()
    
    checkReceipt.isDeleted = true;
    checkReceipt.save()
    res.status(200).json({ success: true, message: "Password successfully changed"}) 
  } catch (error) {
    console.log('catch', error)
    return res.status(422).json({ success: false, message: "error: ", error})
  }
}