const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only JPG JPEG and PNG files are allowed'));
    }

    cb(undefined, true);
    // cb(new Error('File must be a PDF'))
    // cb(undefined, true)
  }
});

module.exports = upload;
