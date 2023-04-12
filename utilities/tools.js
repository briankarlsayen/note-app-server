const crypto = require('crypto');
exports.isURL = (str) => {
  // let res = str.match(
  //   /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  // );
  // return res !== null;
  if (typeof str !== 'string') return null;
  let regex =
    /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!regex.test(str)) {
    return false;
  } else {
    return true;
  }
};

exports.limitStringLen = (str) => {
  if (typeof str !== 'string') return null;
  const strLen = 255;
  return str.substring(0, strLen);
};

exports.hashString = (inputString) => {
  console.log('inputString', inputString);
  const sha1Hash = crypto.createHash('sha1');
  sha1Hash.update(inputString);
  const hexDigest = sha1Hash.digest('hex');
  return hexDigest.substr(0, 20);
};
