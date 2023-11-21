const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const storageModels = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tempModel");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 500, // 500gb
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" || true
    ) {
      cb(null, true);
    } else {
      return cb(new Error("INVALID_TYPE"), false);
    }
  },
});


const uploadModel = multer({
  storage: storageModels,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 500, // 500gb
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" || true
    ) {
      cb(null, true);
    } else {
      return cb(new Error("INVALID_TYPE"), false);
    }
  },
});

router.post("/api/upload_file", upload.single("file"), function (req, res) {
  if (!req.file) {
    throw Error("FILE_MISSING");
  } else {
    console.log("GOT REQ", req);
    res.send({ status: "success", filename : req.file.filename, filesize : req.file.size });
  }
});


router.post("/api/upload_model", uploadModel.single("file"), function (req, res) {
  if (!req.file) {
    throw Error("FILE_MISSING");
  } else {
    console.log("GOT REQ", req);
    res.send({ status: "success", filename : req.file.filename });
  }
});

//Error handling
router.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.statusCode = 400;
    res.send({ code: err.code });
  } else if (err) {
    if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE") {
      res.statusCode = 400;
      res.send({ code: err.message });
    } else {
      res.statusCode = 500;
      res.send({ code: "GENERIC_ERROR" });
    }
  }
});



module.exports = router
