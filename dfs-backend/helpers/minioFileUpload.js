const Minio = require("minio");
const { MINIO_ENDPOINT, MINIO_BUCKET } = require("../creds");
const { execSql } = require("../db");

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const moveFileToMinio = (filename) => {
  return new Promise((res, rej) => {
    const QUERY_FILE_DETAILS_FROM_ID = `SELECT * FROM Files WHERE upfilename="${filename}" OR upfilenameMD="${filename}"`;

    return execSql(QUERY_FILE_DETAILS_FROM_ID)
      .then((result) => {

        if (result[0]["minio"] === 1) {
          return rej("File is already uploaded to minio");
        }
        
        const filePath = "uploads/" + filename;

        const metaData = {
          "Content-Type": "application/octet-stream",
        };

        return minioClient.fPutObject(MINIO_BUCKET, filename, filePath, metaData)
          .then(() => {
            const QUERY_SET_FILE_MINIO_STATUS = `UPDATE Files SET minio = true WHERE upfilename="${filename}" OR upfilenameMD="${filename}"`;

            return execSql(QUERY_SET_FILE_MINIO_STATUS)
              .then((result) => {
                console.log("Minio flag updated");
                res(result);
              })
              .catch((err) => {
                console.log(err);
                rej(err);
              });
          })
          .catch((err) => {
            console.log(err);
            rej(err);
          });
      })
      .catch((err) => {
        console.log(err);
        rej(err);
      });
  });
}

const getFileUrlFromMinio = (filename) => {
  var url = undefined;
  minioClient.presignedGetObject(MINIO_BUCKET, filename, (err, presignedUrl) => {
    if (err) return console.log(err);
    url = presignedUrl;
  });
  return url;
}

module.exports = {
  moveFileToMinio,
  getFileUrlFromMinio
}