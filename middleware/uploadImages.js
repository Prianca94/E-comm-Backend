const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require('node:fs');


const multerStorage = multer.diskStorage({
 
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    console.log(uniqueSuffix);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const prodImageResize = async (req, res, next) => {
  if (!req.files) {
    next();
  }

  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path).resize(300, 300).toFormat("jpeg").jpeg({ quality: 90 }).
      toFile(`public/images/products/${file.filename}`);

      // fs.unlinkSync(`public/images/products/${file.filename}`, (err) => {
      //   console.log(err);
      // });

    })
  );
  next();
};

const blogImageResize = async (req, res, next) => {
  if (!req.files) {
    next();
  }
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path).resize(300, 300).toFormat("jpeg").jpeg({ quality: 90 }).
      toFile(`public/images/blogs/${file.filename}`);
    })
  );

  next();
};

module.exports = { uploadPhoto, prodImageResize, blogImageResize };
