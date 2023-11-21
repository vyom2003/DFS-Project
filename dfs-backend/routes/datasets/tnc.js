const express = require("express");
const router = express.Router();
const { execSql } = require("../../db");
const { detokn } = require("../auth/utils");
// const { detokn } = require('../auth/utils');

function getDatasetPermission(target_id, headers) {
  return new Promise((resolve, reject) => {
    if (headers.authorization) {
      const user = detokn(headers.authorization.split("Bearer ")[1]);
      let query = `SELECT * FROM Dataset WHERE dataset_id="${target_id}"`;
      execSql(query)
        .then((res) => {
          if (res[0]) {
            if (res[0].author_id === user.user_email) {
              resolve("user exists");
            } else {
              reject("USER_NOT_AUTHOR");
            }
          } else {
            query = `SELECT * FROM Files WHERE upfilename="${target_id}"`;
            execSql(query).then((res) => {
              console.log("AMEY!!!!", res);
              if (res[0]) {
                if (res[0].author_id === user.user_email) {
                  resolve("user exists");
                } else {
                  reject("USER_NOT_AUTHOR");
                }
              } else reject("NO_TABLE");
            });
          }
        })
        .catch((err) => {
          return reject("SQL_ERROR");
        });
    } else return reject("NO_HEADERS_PROVIDED");
  });
}

router.get("/api/tnc", (req, res) => {
  var { target_id } = req.query;
  let query = `SELECT md_data FROM Tnc WHERE target_id="${target_id}"`;
  execSql(query)
    .then((result) => res.json({ error: false, data: result }))
    .catch((err) => res.json({ error: true, data: err }));
});

router.post("/api/tnc", (req, res) => {
  var { target_id, dataset_level } = req.query;
  const { token, md_data } = req.body;
  getDatasetPermission(target_id, req.headers)
    .then((res1) => {
      let query = `SELECT md_data FROM Tnc WHERE target_id="${target_id}" AND dataset_level="${dataset_level}"`;
      console.log("AMEY", query);
      execSql(query)
        .then((res1) => {
          console.log("AMEY 1");
          if (res1.length === 0) {
            query = `INSERT INTO Tnc Values ("${target_id}", "${dataset_level}", '${md_data}')`;
          } else {
            query = `UPDATE Tnc SET md_data='${md_data}' WHERE target_id="${target_id}"`;
          }
          execSql(query).then((res2) => {
            res.json({ error: false, data: res2 });
          }).catch(err => {
            console.log('AMEY1', err);
          });
        })
        .catch((err) => res.json({ error: true, data: err }));
    })
    .catch((err) => {
      console.log("AMEY HERE ERR", err);
      switch (
        err.message // TODO, for each error message
      ) {
        default:
          console.log("GET DATASET PERMISSIONS ERROR", err);
          res.status(400).json(err);
      }
    });
});

module.exports = router;
