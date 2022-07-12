const { User } = require('../models')

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