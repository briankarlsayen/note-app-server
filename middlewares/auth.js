const protect = (req, res, next) => {
  if(!req.isAuthenticated()) return res.status(422).json({message: "You do not have access to this route"});
  next()
}

module.exports = {protect}