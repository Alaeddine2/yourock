
const express = require("express");
const utils = require("../utils/util_methods");
const fs = require("fs");
const mime = require("mime");
const multer = require("multer");
const router = express.Router();
const configs = require('../config/config');

const upload = multer({
    dest: 'public/',
    /*storage: storage,
    limits: {
      fileSize: max_upload_size,
    },*/
});

router.post("/upload",utils.extractToken, upload.array("file", 1),(req, res) => {
    try{
        var file_path = ""
        req.files.forEach(async (file) => {
        const new_file_name = `${new Date().getTime()}.${mime.getExtension(file.mimetype)}`;
        fs.rename(
            file.path,
            `public/${new_file_name}`,
            function (err) {
              if (err) throw err;
            }
          );
          file_path = `http://localhost:${configs.BACKEND_PORT}/${new_file_name}`
        });
        res.status(200).json({
            code: "API.UPLOAD.SUCESS",
            message:"Data Uploaded",
            data: file_path
        });
      }catch(err){
          res.status(400).send(err)
      }
});

module.exports = router;
