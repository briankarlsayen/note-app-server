const cloudinary = require('cloudinary').v2;

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUD_KEY;
const api_secret = process.env.CLOUD_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: 'auto',
};

module.exports.uploadSingleImage = (image, pubId) => {
  //imgage = > base64
  opts.public_id = pubId ?? undefined;
  return new Promise((resolve, reject) => {
    console.log('opts', opts);
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

module.exports.uploadStream = async (imgStream) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ format: 'jpeg' }, (error, result) => {
        if (error) {
          console.log(err);
          return reject({ message: error.message });
        } else {
          console.log(`Upload succeed: ${result}`);
          return resolve(result.secure_url);
          // filteredBody.photo = result.url;
        }
      })
      .end(imgStream);
  });
};

module.exports.deleteImage = (imagePubId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imagePubId, (error, result) => {
      if (result && result.result === 'ok') {
        return resolve(result.result);
      }
      console.log('err', error?.message);
      return reject({ message: error?.message ?? 'Unable to delete image' });
    });
  });
};
