const multer = require('multer')
const { join, extname } = require('path')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, join(__dirname, "../uploads"));
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "." + Date.now() + extname(file.originalname))
  },
});

const  fileFilter = (req, file, cb) => {
  console.log('file', file)
  let allowMimes = ["image/jpeg", "image/png"];
  if(allowMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      {
        success: false,
        message: "Invalid file type",
      },
      false
    );
  }
}

const obj = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
})

const upload = multer(obj).single("image");

exports.uploadImage = (req, res, next) => {
  upload(req, res, function(error) {
    if(error) {
      res.status(500);
      if(error.code == "LIMIT_FILE_SIZE") {
        error.message = "File size is too large. Allowed file size is 5MB";
        error.success = false;
      }
      return res.json(error)
    }
    next()
  });
};

exports.uploadMemory = (req, res, next) => {
  const memStorage = multer.memoryStorage();
  const memUpload = multer({ storage: memStorage }).single('image');
  memUpload(req, res, function(error) {
    if(error) {
      res.status(500);
      if(error.code == "LIMIT_FILE_SIZE") {
        error.message = "File size is too large. Allowed file size is 5MB";
        error.success = false;
      }
      return res.json(error)
    }
    next()
  });
}