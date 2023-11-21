const express = require('express');
const router = express.Router();
const { execSql } = require('../../db');
const { detokn } = require('../auth/utils.js');

// const { detok } = require('../auth/utils').default;

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

router.get('/api/datasets', (req, res) => {
  const { domain, login, UserId } = req.query;
  const QUERY_GET_FILTERED_DATASETS = `select * from (select Dataset.public as public, Dataset.domain as domain, Dataset.dataset_id as dataset_id, Dataset.dataset_name as dataset_name, Dataset.dataset_description as dataset_description, Dataset.source as source, count(Files.upfilename) as filecount from Dataset LEFT JOIN (select * from Files WHERE verification='verified') as Files ON Dataset.dataset_id=Files.database_id GROUP BY Dataset.dataset_id, Dataset.dataset_name, Dataset.domain, Dataset.public) as filteredTable where filteredTable.filecount > 0 AND filteredTable.public${domain ? ' AND filteredTable.domain=' + '"' + domain + '"' : ''}`;

  execSql(QUERY_GET_FILTERED_DATASETS).then(async (sqlres) => {
    if (!login) {
      for (let i of sqlres) {
        i["added"] = false
        i["paid"] = false
      }
      res.json({
        error: false,
        data: sqlres
      });
    }
    else {
      const get_paid = `Select * from PurchaseItems where UserId = '${UserId}'`
      await execSql(get_paid).then(async (res_paid) => {
        const query2 = "SELECT database_id, databaseVersion_id, created_date FROM (SELECT database_id, databaseVersion_id, created_date, ROW_NUMBER() OVER (PARTITION BY database_id ORDER BY created_date DESC) AS rn FROM Files) AS RankedFiles WHERE rn = 1";
        await execSql(query2).then(async (result) => {
          version = result
          let query = `select ItemID,versionId from CartItems where UserId = '${UserId}'`
          await execSql(query).then(res2 => {
            let arr = []
            let arr_paid = []
            for (let i of result) {
              let flag = false
              for (let j of res2) {
                if (i["database_id"] == j["ItemID"] && i["databaseVersion_id"] == j["versionId"]) {
                  flag = true
                }
              }
              if (flag) {
                arr.push(i["database_id"])
              }
            }
            for (let i of result) {
              let flag = false
              for (let j of res_paid) {
                if (i["database_id"] == j["ItemID"] && i["databaseVersion_id"] == j["versionId"]) {
                  flag = true
                }
              }
              if (flag) {
                arr_paid.push(i["database_id"])
              }
            }
            // console.log(arr_paid)
            for (let i of sqlres) {
              if (arr.includes(i["dataset_id"])) {
                i["added"] = true
                i["paid"] = false
              }
              else if(arr_paid.includes(i["dataset_id"])){
                i["added"] = false
                i["paid"] = true
              }
              else {
                i["added"] = false
                i["paid"]  = false
              }
            }
            console.log(sqlres)
            res.json({
              error: false,
              data: sqlres
            });

          }).catch(err => {
            console.log(err)
            res.status(400).json({
              error: true,
              message: "SQL Error",
              data: err
            });
          });


        }).catch(err => {
          console.log(err)
          res.sendStatus(400)
        });
      }).catch(err => {
        console.log(err)
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data: err
        });
      });
    }

  }).catch(err => {
    res.status(400).json({
      error: true,
      message: "SQL Error",
      data: err
    });
  });
});


router.post('/api/add-dataset', (req, res) => {
  if (req.headers.authorization) {
    console.log(req.headers.authorization.split('Bearer ')[1]);
    const user = detokn(req.headers.authorization.split('Bearer ')[1])
    if (user.user_email && user.user_email && user.user_email == req.body.authorId) {
      let query = `INSERT INTO Dataset VALUES (
        '${req.body.datasetId}',
        '${req.body.authorId}',
        '${req.body.referenceList}',
        '${req.body.datasetName}',
        '${req.body.piSepDescStr.replaceAll("'", "''")}', 1,
        '${req.body.source}', null,
        '${req.body.datasetFormat}', 0, 'APPROVED',
        '${req.body.domain}'
      )`;
      console.log(query);
      execSql(query)
        .then(sqlres => {
          res.json({
            error: false,
            data: sqlres
          });
        }).catch(err => {
          console.log(err.code);
          if (err.code == 'ER_DUP_ENTRY') {
            res.json({
              error: true,
              message: err.code
            });
          } else {
            console.log("400 error", err);
            res.status(400).json({
              error: true,
              message: "SQL Error",
              data: err
            });
          }
        });
    } else res.status(401).json({ error: true, message: 'Invalid token' });
  } else {
    res.status(401).json({ error: true, message: 'Invalid token' });
  }
})

router.get('/api/get-dataset-id', (req, res) => {

  const { id } = req.query;
  if (id) {
    const query = `SELECT * FROM Dataset WHERE dataset_id = "${id}"`;
    execSql(query)
      .then(sqlres => {
        console.log('GOT ', sqlres, 'FOR', id);
        res.json({
          error: false,
          data: sqlres
        });
      }).catch(err => {
        console.log(err.code);
        if (err.code == 'ER_DUP_ENTRY') {
          res.json({
            error: true,
            message: err.code
          });
        } else {
          console.log("400 error", err);
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err
          });
        }
      });
  }
  else {
    res.status(400).json({ error: true, message: 'Invalid params' });
  }
})

router.post("/api/update-dataset-visibility", (req, res) => {
  if (req.body.headers.Authorization) {
    const user = detokn(req.body.headers.Authorization.split("Bearer ")[1]);
    if (req.body && user && req.body.params) {
      const QUERY_UPDATE_DATASET_VISIBLITY = `UPDATE Dataset
        SET public = '${req.body.selectedVisiblity === 'Listed' ? 1 : 0}'
        WHERE dataset_id = '${req.body.params.datasetId}' and author_id = '${user.user_email}'`;
      execSql(QUERY_UPDATE_DATASET_VISIBLITY)
        .then((sqlres) => {
          res.json({
            currentVisiblity: req.body.selectedVisiblity,
            error: false,
          });
        })
        .catch((err) => {
          res.status(400).json({
            error: true,
            message: "Invalid props",
          });
        });
    }
    else {
      res.status(400).json({
        error: true,
        message: "Authentication error",
      });
    }
  }
});

router.post('/api/contact', (req, res) => {
  const query = `INSERT INTO ContactUs (NAME, EMAIL, MESSAGE) VALUES ('${req.body.name}','${req.body.email}','${req.body.message}')`;
  execSql(query)
    .then(sqlres => {
      res.json({
        error: false,
        data: sqlres
      });
    }).catch(err => {
      if (err.code == 'ER_DUP_ENTRY') {
        res.json({
          error: true,
          message: err.code
        });
      } else {
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data: err
        });
      }
    });
})
router.get('/api/view-contact-us-queries', (req, res) => {
  const query = `SELECT * FROM ContactUs`;
  execSql(query)
    .then(sqlres => {
      res.json({
        error: false,
        data: sqlres
      });
    })
})
router.post('/api/contactDelete', (req, res) => {
  const query = `DELETE FROM ContactUs WHERE EMAIL in ('${req.body.email}')`;
  execSql(query)
    .then(sqlres => {
      res.json({
        error: false,
        data: sqlres
      });
    })
})
router.get('/api/count-contact-us-queries', (req, res) => {
  const query = `SELECT COUNT(EMAIL) FROM ContactUs`;
  execSql(query)
    .then(sqlres => {
      res.json({
        error: false,
        data: sqlres
      });
    })
})
module.exports = router
