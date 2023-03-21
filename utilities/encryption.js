const crypto = require('crypto');

const publicKey = process.env.PUB_KEY;
const privateKey = process.env.PRIV_KEY;

const secretKey = process.env.SECRET_PASS;

// TODO use crypto-js lib
const cryptoAESencrypt = (publicKey, data) => {
  console.log('secretKey', secretKey);
  const hashedKey = crypto
    .createHash('sha256')
    .update(String(secretKey))
    .digest('base64');
  const key_in_bytes = Buffer.from(hashedKey, 'base64');
  const iv = hashedKey.toString('hex').slice(0, 16);
  // const iv = crypto.randomBytes(32).toString('hex').slice(0, 16);
  // const iv = 'd8273523e7654a36';
  const encrypted = crypto.createCipheriv('aes-256-cbc', key_in_bytes, iv);
  let final = encrypted.update(data, 'utf8', 'hex');
  console.log('final', final);
  final += encrypted.final('hex');
  // final += ':' + iv;
  console.log('final', final);
  return final;
};

const cryptoAESdecrypt = (data) => {
  return crypto.AES.decrypt(data, secretKey);
};

const encrypt = (data) => {
  try {
    const publicKey = Buffer.from(process.env.PUB_KEY, 'base64').toString(
      'ascii'
    );
    // const buffer = Buffer.from(data, 'utf8');

    // const result = crypto.publicEncrypt(
    //   {
    //     key: publicKey,
    //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //     oaepHash: 'sha256',
    //   },
    //   buffer
    // );

    // return result.toString('base64');
    return cryptoAESencrypt(publicKey, data);
  } catch (err) {
    console.log('Invalid encryption key');

    return data;
  }
};

const decrypt = (encryptedData) => {
  try {
    if (!encryptedData) return null;
    const privateKey = Buffer.from(process.env.PRIV_KEY, 'base64').toString(
      'ascii'
    );
    const buffer = Buffer.from(encryptedData, 'base64');
    const result = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return cryptoAESdecrypt(encryptedData);
    return result.toString('utf-8');
  } catch (err) {
    console.log('Invalid decryption key');
    return encryptedData;
  }
};

module.exports = { encrypt, decrypt };
