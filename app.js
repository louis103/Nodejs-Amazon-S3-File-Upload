const express = require("express");
const dotenv = require('dotenv');
const app = express();
const aws = require('aws-sdk');
const multer = require("multer");
const multerS3 = require("multer-s3");
dotenv.config({ path: './config/config.env' });
//configuring aws s3
aws.config.update({
    secretAccessKey:process.env.SECRET_ACCESS_KEY,
    accessKeyId:process.env.ACCESS_KEY_ID,
    region:process.env.REGION
});
const BUCKET_NAME = process.env.BUCKET;
// configure multer
const s3 = new aws.S3();
const upload = multer({
        storage:multerS3({
            bucket:BUCKET_NAME,
            s3:s3,
            // acl:'public-read',
            key:(req,file,callback)=>{
                callback(null, Date.now() + file.originalname)
            }
    })
});
//endpoints
//uploading files + middleware
app.post("/v1/s3/upload", upload.single("file") ,(req,res)=>{
    console.log(req.file);
    res.send("Successfully uploaded "+ req.file.location+ ' location!');
});
//listing files in s3 bucket
app.get("/v1/s3/list", async (req,res) => {
    let results = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise()
    let result_list = results.Contents.map(item => item.Key);
    res.send(result_list);
});
//download files from s3
app.get("/v1/s3/download/:filename", async (req,res) => {
    const filename = req.params.filename;
    let newFile = await s3.getObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
    res.send(newFile.Body);
});
//delete files from s3
app.delete("/v1/s3/delete/:filename", async (req,res) => {
    const filename = req.params.filename;
    await s3.deleteObject({ Bucket: BUCKET_NAME, Key: filename}).promise();
    res.send("File deleted successfully!");
});





app.listen(3000, (error,success)=> {
    if (error){
        throw error;
    }
    console.log("S3 Server is running.");
})