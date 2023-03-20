/**
 * This module will generate a public and private keypair and save to current directory
 *
 * Make sure to save the private key elsewhere after generated!
 */
const crypto = require('crypto');
const fs = require('fs');

function genKeyPair() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
  });

  const pubKey = Buffer.from(keyPair.publicKey)
    .toString('base64')
    .replace(/(\r\n|\n|\r)/gm, '');
  const priKey = Buffer.from(keyPair.privateKey)
    .toString('base64')
    .replace(/(\r\n|\n|\r)/gm, '');
  let content = `PUB_KEY=${pubKey}\nPRIV_KEY=${priKey}`;

  fs.writeFileSync(__dirname + '/env.dev', content); // create .env.dev file, stores private key & pub key
}

genKeyPair();
