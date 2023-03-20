const crypto = require('crypto');

const publicKey = process.env.PUB_KEY;
const privateKey = process.env.PRIV_KEY;

const encrypt = (data) => {
  try {
    const publicKey = Buffer.from(process.env.PUB_KEY, 'base64').toString(
      'ascii'
    );
    const buffer = Buffer.from(data, 'utf8');

    const result = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );

    return result.toString('base64');
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
    return result.toString('utf-8');
  } catch (err) {
    console.log('Invalid decryption key');
    return encryptedData;
  }
};

module.exports = { encrypt, decrypt };
