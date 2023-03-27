const { User, MailReceipt, Gauth } = require('../models');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sendEmail } = require('../utilities/sendEmail');
const { issueJWT } = require('../middlewares/auth');
const decodeToken = require('jwt-decode');
const { encrypt } = require('../utilities/encryption');

const validatePassword = async (password, dbPassword) => {
  return bcrypt.compare(password, dbPassword);
};

exports.register = async (req, res, next) => {
  const { name, email, mobileNo, password } = req.body;
  try {
    const encryptedText = encrypt(name);
    console.log('encrypting', encryptedText);
    // return res.status(200).json('taguro');
    // console.log('registering...');
    const emailExist = await User.findOne({
      where: { email, isDeleted: false },
    });
    if (emailExist)
      return res.status(422).json({ message: 'Email already exist' });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      mobileNo,
      password: hashedPassword,
      accType: 'basic',
    });
    if (!user)
      return res
        .status(422)
        .json({ success: false, message: 'Unable to create user' });
    const options = {
      to: email,
      subject: 'Successful registration',
      code: 'RC',
    };
    sendEmail(options);

    res
      .status(201)
      .json({ success: true, message: 'Successfully created', user });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: { isDeleted: false },
      include: 'gauth',
    });
    res.status(201).json(user);
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // await User.get();
    // console.log('decUser', decUser);
    const user = await User.findOne({ where: { email: username } });
    // console.log('user', user);
    // user.get();
    // const decUser = await User.findOne({ where: { email: username } });

    if (!user)
      return res.status(422).json({ success: false, message: 'Invalid user' });
    console.log('user', user);
    if (user.accType === 'gauth')
      return res
        .status(422)
        .json({ success: false, message: 'Please sign in using gmail' });

    if (await validatePassword(password, user.password)) {
      const tokenObject = issueJWT(user, 'basic');
      return res.status(200).json({
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } else {
      return res.status(422).json({ success: false, message: 'Login failed' });
    }
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.updateUser = async (req, res, next) => {
  const { name, email, mobileNo } = req.body;
  const uuid = req.jwt.sub;
  try {
    const emailExist = await User.findOne({
      where: { uuid: { [Op.not]: uuid }, email },
    });
    if (emailExist)
      return res.status(422).json({ message: 'Email already exist' });

    const user = await User.findOne({ where: { uuid } });
    if (!user)
      return res
        .status(422)
        .json({ success: false, message: 'Unable to find user' });
    user.name = name;
    user.email = email;
    user.mobileNo = mobileNo;
    user.save();
    res.status(201).json(user);
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.getUser = async (req, res, next) => {
  const { sub } = req.jwt;
  try {
    const user = await User.findOne({
      where: { uuid: sub, isDeleted: false },
      include: 'gauth',
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.archiveUser = async (req, res, next) => {
  const { uuid } = req.params;
  try {
    const user = await User.findOne({ where: { uuid, isDeleted: false } });
    if (!user)
      return res
        .status(422)
        .json({ success: false, message: 'Unable to find user' });
    user.isDeleted = true;
    user.save();
    res.status(201).json(user);
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  try {
    const options = {
      to: email,
      subject: 'Forgot password',
      code: 'FP',
    };
    sendEmail(options);
    res.status(200).json({ success: true, message: 'Mail successfully sent' });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.changePassword = async (req, res, next) => {
  const { password, retyped } = req.body;
  const { id } = req.params;
  try {
    const currentDate = new Date();
    // const checkReceipt = await MailReceipt.findOne({ where: { msgId: id }})
    const checkReceipt = await MailReceipt.findOne({
      where: { msgId: id, expires: { [Op.gt]: currentDate }, isDeleted: false },
    });
    if (!checkReceipt)
      return res.status(422).json({
        success: false,
        message:
          'Your request has already expired, please make another request',
      });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.findOne({
      where: { email: checkReceipt.to, isDeleted: false },
    });
    if (!user)
      return res
        .status(422)
        .json({ success: false, message: 'Unable to find user' });
    user.password = hashedPassword;
    user.save();

    checkReceipt.isDeleted = true;
    checkReceipt.save();
    res
      .status(200)
      .json({ success: true, message: 'Password successfully changed' });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};

exports.googleSignIn = async (req, res, next) => {
  const { credentials } = req.body;
  try {
    console.log('google signing in...');
    if (!credentials)
      return res
        .status(422)
        .json({ success: false, message: 'Missing input fields' });

    const decode = decodeToken(credentials);
    console.log('decode', decode.sub);
    // const accountExist = await Gauth.findOne({
    //   where: { sub: decode.sub, isDeleted: false },
    //   // include: 'user',
    // });

    const accountExist = await Gauth.findOne({
      where: { accId: decode.sub },
      include: 'user',
    });

    // console.log("henlo", accountExist);
    let userData;

    if (!accountExist) {
      const user = await User.create({
        name: decode.name,
        email: decode.email,
        accType: 'gauth',
      });
      const userJson = user.dataValues; // .toJSON not working due to model restrict
      const account = await Gauth.create({
        accId: decode.sub,
        userId: userJson.id,
      });

      if (!account)
        return res
          .status(422)
          .json({ success: false, message: 'Unable to create' });

      userData = userJson;
    } else {
      const accountJson = accountExist.toJSON();
      console.log('accountJson', accountJson);
      userData = accountJson.user;
    }
    console.log('userData');
    const tokenObject = issueJWT(userData);
    console.log('token');
    return res.status(200).json({
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
    });
  } catch (error) {
    return res.status(422).json({ success: false, message: 'error: ', error });
  }
};
