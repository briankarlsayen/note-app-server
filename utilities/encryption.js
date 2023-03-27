const crypto = require('crypto');

const publicKey = Buffer.from(process.env.PUB_KEY, 'base64').toString('ascii');
const privateKey = Buffer.from(process.env.PRIV_KEY, 'base64').toString(
  'ascii'
);

const rsaEncryption = (props) => {
  try {
    const buffer = Buffer.from(props.data, 'utf8');
    const result = crypto.publicEncrypt(
      {
        key: props.convertedKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return result.toString('base64');
  } catch (err) {
    console.log('Invalid encryption key');
    return '';
  }
};

const rsaDecryption = (props) => {
  try {
    const buffer = Buffer.from(props.data, 'base64');
    const result = crypto.privateDecrypt(
      {
        key: props.convertedKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      buffer
    );
    return result.toString('utf-8');
  } catch (err) {
    console.log('Invalid decryption key');
    return '';
  }
};

const encrypt = (props) => {
  try {
    return rsaEncryption({ ...props, convertedKey: publicKey });
  } catch (err) {
    console.log('Encryption failed', err);
    return new Error('Invalid encryption type');
  }
};

const decrypt = (props) => {
  try {
    return rsaDecryption({ ...props, convertedKey: privateKey });
  } catch (err) {
    console.log('Encryption failed', err);
    return new Error('Invalid encryption type');
  }
};

module.exports = { encrypt, decrypt };
