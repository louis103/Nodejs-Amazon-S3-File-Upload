require("dotenv").config();
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid").v4;
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    ACL: "public-read",
    metadata: (req, file, cd) => {
      cd(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${uuid()}${ext}`;
      cb(null, uniqueName);
    },
  }),
});
module.exports = {
    upload
} 
router.post("/photo-upload", upload.array('photos'), (req, res) => {  
    return res.status(200).send({
      success: true,
      result: 'Images Uploaded',
    });
});
const express = require("express");
const router = express.Router();
const upload = require("./fileUpload")  
    router.post("/", upload.array("image"), (req, res) => {
    res.send("uploaded")
}

// module.exports = router;


//file upload
// const aws = require("aws-sdk")
//     const multer = require("multer")
//     const multerS3 = require("multer-s3")
//     const uuid = require("uuid").v4
//     const path = require("path")

//     const s3 = new aws.S3({
//         accessKeyId: <secret-id>,
//         secretAccessKey: <secret-key>,
//         region: <server-region>,
//         apiVersion: "2012-10-17"
//     })
    
//     const upload = multer({
//         storage: multerS3({
//             s3:s3,
//             bucket: <bucket-name>,
//             acl: "public-read",
//             metadata: (req, file, cd) => {
//                 cd(null, {fieldName: file.fieldname})
//             },
//             key: async (req, file, cb) => {
//                 const ext = path.extname(file.originalname)
//                 const uniqueName = `${uuid()}${ext}`
//                 cb(null, uniqueName)
//             },
            
            
//         })
//     })