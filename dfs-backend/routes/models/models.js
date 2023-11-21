const express = require("express");
const router = express.Router();
const { execSql } = require("../../db");
const { detokn } = require("../auth/utils");
const fs = require("fs");

// dataset_version_id,
// dataset_id,
// domain,
// model_id,
// model_name,
// group_id,
// author_id,
// author_name,
// authors_names,
// authors_ids,
// created_datetime,
// last_updated,
// updates,
// jsondata

// create model
router.post("/api/add-model", (req, res) => {
  if(req.headers.authorization){
    const user = detokn(req.headers.authorization.split('Bearer ')[1]);
    if (user) {
      const {
        dataset_version_id,
        dataset_id,
        domain,
        model_id,
        model_name,
        group_id,
        UploadDate,
        upfilename,
        isReadChecked,
        isWriteChecked
      } = req.body;
      console.log(user);

      const now = new Date() - 0 + "";
      fs.readFile("tempModel/" + upfilename, function (err, data) {
        if (err) {
          res.json({
            error: true,
            message: "Error in reading the file"
          });
        } else {
          if (user.user_email) {
            const command = `INSERT INTO Models values(
              '${dataset_version_id}',
              '${dataset_id}',
              '${domain}',
              '${model_id}',
              '${model_name}',
              '${group_id}',
              '${user.user_email}',
              '${user.first_name}',
              '${user.first_name}',
              '${user.user_email}',
              '${UploadDate}',
              '${now}',
              '${1}',
              '${upfilename}',
              ${isReadChecked},
              ${isWriteChecked}
            )`;
            execSql(command)
              .then((sqlres) => {
                // fs.unlink("tempModel/" + upfilename, (err=>{
                //   if(err)
                //   {
                //     res.json({
                //       error: true,
                //       message: "Error in removing the file",
                //     })
                //   }
                //   else
                //   {
                //     res.json({
                //       error: false,
                //       message: "Model Added Successfully!",
                //       data: sqlres,
                //     });
                //   }             
                // }));
                res.json({
                  error: false,
                  message: "Model Added Successfully!",
                  data: sqlres,
                });
              })
              .catch((err) => {
                if (err.code == "ER_DUP_ENTRY") {
                  res.json({
                    error: true,
                    message: err.code,
                  });
                } else {
                  res.status(400).json({
                    error: true,
                    message: "SQL Error",
                    data: err,
                  });
                }
              });
          }
          else res.status(403).json({
            error: true,
            message: "user not logged in"
          });
        }
      });
    } else res.status(403).json({
      error: true,
      message: "user not logged in"
    });
  }
  else{
    res.status(403).json({
      error: true,
      message: "user not logged in"
    });
  }
  
});

// dataset_version_id,
// dataset_id,
// domain,
// model_id,
// model_name,

router.get("/api/models", (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization.split("Bearer ")[1]);
    let query = "SELECT Models.*,DfsUser.institution FROM Models inner join DfsUser on author_id=user_email";
    if (req.query.domain) query += ' WHERE domain="' + req.query.domain + '"';
    else if (req.query.dataset_id)
      query += ' WHERE dataset_id="' + req.query.dataset_id + '"';
    else if (req.query.dataset_version_id)
      query += ' WHERE dataset_id="' + req.query.dataset_version_id + '"';
    else if (req.query.model_id)
      query += ' WHERE dataset_id="' + req.query.model_id + '"';
    else if (req.query.model_name)
      query += ' WHERE model_name LIKE "%' + req.query.model_name + '%"';
    execSql(query)
      .then((sqlres) => {
        query = 'SELECT institution FROM DfsUser WHERE user_email=' + `"${user.user_email}"`;
        execSql(query)
          .then((sqlres2) => {
            for (let i = 0; i < sqlres.length; i++) {
              if ((sqlres[i]['group_read'] || sqlres[i]['group_write']) && sqlres[i]['institution'] === sqlres2[0]['institution']) {
                sqlres[i]['access_type'] = 'Group';
              }
              else {
                sqlres[i]['access_type'] = 'Public';
              }
            }
            res.json({
              error: false,
              data: sqlres,
            });
          })
          .catch((err) => {
            res.json({
              error: true,
              message: err.code,
            });
          })
      })
      .catch((err) => {
        if (err.code == "ER_DUP_ENTRY") {
          res.json({
            error: true,
            message: err.code,
          });
        } else {
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err,
          });
        }
      });
  } else res.status(403).json({ error: "user not logged in" });
});

router.get("/api/models-my", (req, res) => {
  if(req.headers.authorization){
    const user = detokn(req.headers.authorization.split('Bearer ')[1]);
    if (user) {
      if (user.user_email) {
        let query = `SELECT * FROM Models WHERE author_id = '${user.user_email}'`;
        console.log(query)
        execSql(query)
          .then((sqlres) => {
            res.json({
              error: false,
              data: sqlres,
            });
          })
          .catch((err) => {
            if (err.code == "ER_DUP_ENTRY") {
              res.json({
                error: true,
                message: err.code,
              });
            } else {
              res.status(400).json({
                error: true,
                message: "SQL Error",
                data: err,
              });
            }
          });
      }
      else {
        res.status(403).json({
          error: true,
          message: "user not logged in",
        });
      }
    } else res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
  else{
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
  
});


router.post("/api/edit-model-json", (req, res) => {
  if (req.headers.authorization) {
    const {
      model_id,
      upfilename,
    } = req.body;
    const user = detokn(req.headers.authorization.split("Bearer ")[1]);
    fs.readFile("tempModel/" + upfilename, function (err, data) {
      if (err) {
        res.json({
          error: true,
          message: "Error in reading the file"
        });
      }
      else {
        // const fileJson = JSON.stringify(JSON.parse(data));
        const CurrDate = new Date() - 0 + "";
        const queryInitial = `SELECT UPDATES, authors_names, authors_ids FROM Models WHERE model_id = '${model_id}'`;
        execSql(queryInitial)
          .then((sqlInitialRes) => {
            const OldUpdate = sqlInitialRes[0].UPDATES;
            let OldAuthorNames = sqlInitialRes[0].authors_names;
            let OldAuthorIds = sqlInitialRes[0].authors_ids;
            // const OldJsonData = sqlInitialRes[0].jsondata

            const arrIds = OldAuthorIds.split(",");
            let alreadyExists = 0;
            for (let i = 0; i < arrIds.length; i++) {
              if (arrIds[i] == user.user_email) {
                alreadyExists = 1;
                break;
              }
            }
            if (!alreadyExists) {
              OldAuthorIds += ", " + user.user_email;
              OldAuthorNames += ", " + user.first_name;
            }


            const query = `UPDATE Models SET jsondata='${upfilename}', last_updated = '${CurrDate}', updates = '${OldUpdate + 1}', authors_names = '${OldAuthorNames}', authors_ids = '${OldAuthorIds}' WHERE model_id='${model_id}'`;
            console.log(query);
            execSql(query)
              .then((sqlres) => {
                // fs.unlink("tempModel/" + upfilename, (err=>{
                //   if(err)
                //   {
                //     res.json({
                //       error: true,
                //       message: "Error in removing the file",
                //     })
                //   }
                //   else
                // {
                res.json({
                  error: false,
                  data: sqlres,
                  message: "Successfully Updated Model"
                });
                // }             
                // }));
              })
              .catch((err) => {
                if (err.code == "ER_DUP_ENTRY") {
                  res.json({
                    error: true,
                    message: err.code,
                  });
                } else {
                  res.status(400).json({
                    error: true,
                    message: "SQL Error",
                    data: err,
                  });
                }
              });
          })
          .catch((err) => {
            if (err.code == "ER_DUP_ENTRY") {
              res.json({
                error: true,
                message: err.code,
              });
            } else {
              res.status(400).json({
                error: true,
                message: "SQL Error",
                data: err,
              });
            }
          });
      }
    });
  } else res.status(403).json({
    error: true,
    message: "user not logged in",
  });
});


router.get("/api/download-model", (req, res) => {
  if (req.headers.authorization) {
    const {
      model_id,
    } = req.query;
    const query = `SELECT jsondata FROM Models WHERE model_id= '${model_id}'`;
    execSql(query)
      .then((sqlRes) => {
        if (sqlRes.length === 0) {
          res.status(403).json({
            error: true,
            message: "File Data doesn't exist",
          });
        }
        const fileData = sqlRes[0].jsondata;
        const fileName = model_id + "_" + ".txt";
        const filePath = 'tempDownload/' + fileName;
        fs.access(filePath, fs.F_OK, (err) => {
          if (err) {
            fs.writeFile(filePath, fileData, (err_second) => {
              if (err_second) {
                res.status(403).json({
                  error: true,
                  message: "File Data doesn't exist"
                });
              }
              else {
                const timer = setTimeout(() => {
                  fs.unlink(filePath, (err_third => {
                    if (err_third) {
                      res.json({
                        error: true,
                        message: "Error in removing the file",
                      })
                    }
                  }));
                }, 600000);
                res.download(filePath, fileName, (err) => {
                  if (err) {
                    if (res.headersSent) {
                    } else {
                      res.status(404).json({ error: false, message: 'Error! File not found in database' });
                    }
                  }
                });
              }
            });
          }
          else {
            res.download(filePath, fileName, (err) => {
              if (err) {
                if (res.headersSent) {
                } else {
                  res.status(404).json({ error: false, message: 'Error! File not found in database' });
                }
              }
            });
          }
        });
      })
      .catch((err) => {
        if (err.code == "ER_DUP_ENTRY") {
          res.json({
            error: true,
            message: err.code,
          });
        } else {
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err,
          });
        }
      });
  } else res.status(403).json({
    error: true,
    message: "user not logged in"
  });
});


router.get("/api/get-json-data", (req, res) => {
  // if (req.headers.authorization) {
  const {
    model_id,
  } = req.query;
  const query = `SELECT jsondata FROM Models WHERE model_id= '${model_id}'`;
  execSql(query)
    .then((sqlRes) => {
      if (sqlRes.length === 0) {
        console.log("FILE DOESNT EXIST");
        res.status(403).json({
          error: true,
          message: "File doesn't exist",
        });
      } else {
        const fileData = fs.readFileSync('tempModel/' + sqlRes[0].jsondata);
        res.json(JSON.parse(fileData));
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: true,
        message: "SQL Error",
        data: err,
      });
    });
  // } else res.status(403).json({  error:true, 
  // message: "user not logged in" });
});



module.exports = router;
