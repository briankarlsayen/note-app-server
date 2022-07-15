const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { User } = require('../models')
const passport = require('passport')

const validatePassword = async(password, dbPassword) => {
  const result = await bcrypt.compare(password, dbPassword)
  return result;
}
function verifyCallback (username, password, done) {
  User.findOne({ where: { email: username }}) 
    .then(async(user) => {
      if (!user) { return done(null, false) }
      if (await validatePassword(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect username or password' })
      }
    })
    .catch((err) => {  
      done(err);
    });
}
const strategy  = new LocalStrategy(verifyCallback);
passport.use(strategy)

// * save in session data as passport.user
passport.serializeUser((user, done) => done(null, user.uuid))

passport.deserializeUser(async(id, done) => {
  const user = await User.findOne({ where: { uuid: id }, isDeleted: false})
  return done(null, user)
})