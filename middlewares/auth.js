const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const publicKey = Buffer.from(process.env.PUB_KEY , 'base64').toString('ascii');
const privateKey = Buffer.from(process.env.PRIV_KEY , 'base64').toString('ascii');

function issueJWT(user) {
  const _id = user.uuid;
  const expiresIn = '1d';
  const payload = {
    sub: _id,
    iat: Date.now()
  };
  const signedToken = jsonwebtoken.sign(payload, privateKey, { expiresIn: expiresIn, algorithm: 'RS256' });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

function protect(req, res, next) {
  if(req.headers.authorization) {
    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {

      try {
        const verification = jsonwebtoken.verify(tokenParts[1], publicKey, { algorithms: ['RS256'] });
        req.jwt = verification;
        next();
      } catch(err) {
        res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
      }
  
    } else {
      res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
    }
  } else {
    res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
  }
}

module.exports = {protect, issueJWT}