const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1",
});
  let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
    
      let s3 = new AWS.S3({ apiVersion: "2006-03-01" }); 
  
      let uploadParams = {
        ACL: "public-read",
        Bucket: "Bill Payment",
        Key: "Vikash_Vishwakarma/" + file.originalname,
        Body: file.buffer,
      };
  
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          return reject({ error: err });
        }
  
        console.log(" file uploaded succesfully ");
        return resolve(data.Location);
      });
    });
  };

  module.exports = {uploadFile}