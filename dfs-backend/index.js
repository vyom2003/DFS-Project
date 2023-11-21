const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var Multer = require("multer");
var Minio = require("minio");

// var minioClient = new Minio.Client({
//   endPoint: '10.4.25.20',
//   port: 9000,
//   accessKey: 'minioadmin',
//   secretKey: 'QeqMpER3',
// });

// app.post("/api/uploadfile", Multer({dest: "./uploads/"}).single("upload"), function(request, response) {
//   minioClient.fPutObject("dfs", request.file.originalname, request.file.path, "application/octet-stream", function(error, etag) {
//     if(error) {
//       return console.log(error);
//     }
//     response.send(request.file);
//   });
// });

// import * as dotenv from 'dotenv'
require('dotenv').config();
const cors = require('cors')
var morgan = require('morgan')

const { execSql } = require("./db");

app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
  exposedHeaders: ['Content-Disposition']
}))
app.use(morgan('combined'));
app.use('/static', express.static('public'))

const port = 3001

var mysql = require('mysql2');

// TEMPORARY ENDPOINT ONLY FOR TESTING
app.post('/api/', (req, res) => {
  if(req.body.query){
    execSql(req.body.query).then(sres => {
      res.json({error: false, data: sres});
    }).catch(err => {
      res.status(400).json({error: true, data: err});
    });
  }
})

app.get('/api/', (req, res) => {
  res.send('DFS Server, refer to https://github.com/adityakhandelwal15/DFS-Projects/blob/feature_002/backend/docs.md for docs')
})




// add the routes
app.use(require('./routes/view-data-request.js'));    
app.use(require('./routes/data-request-action.js'));
app.use(require('./routes/create-data-request.js'));
app.use(require('./routes/delete-request-action.js'));
app.use(require('./routes/checkreqexist.js'));
app.use(require('./routes/datasets/domains.js'));
app.use(require('./routes/datasets/datasets.js'));
app.use(require('./routes/datasets/versions.js'));
app.use(require('./routes/datasets/tnc.js'));
app.use(require('./routes/models/modelreq.js'));
app.use(require('./routes/models/models.js'));
app.use(require('./routes/auth/token.js'));
app.use(require('./routes/files/fileupload.js'));
app.use(require('./routes/files/sqlfile.js'));
app.use(require('./routes/datasets/authtest.js'));
app.use(require('./routes/datasets/groups'));
app.use(require('./routes/comments.js'));
app.use(require('./routes/datasets/stats.js'));
app.use(require('./routes/cart.js'));
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
// minioClient.bucketExists("dfs", function(error) {
//   if(error) {
//       return console.log(error);
//   }
  var server = app.listen(3001, function() {
      console.log("Listening on port %s...", server.address().port);
  });
// });

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`)
// })
