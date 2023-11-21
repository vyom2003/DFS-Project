const express = require('express');
const router = express.Router();
const { execSql } = require('../../db');
const { detokn } = require('../auth/utils');

// model_id
// request_id
// request_status
// request_for
// requester_id
// requestee_id

router.post('/api/req-model', (req, res) => {
  const {
    model_id,
    comment
  } = req.body;
  console.log(req.body)
  if(req.headers.authorization){
    const user = detokn(req.headers.authorization.split('Bearer ')[1]);
    const requester_id = user.user_email;
    const q0 = `SELECT author_id FROM Models WHERE model_id="${model_id}"`;
    execSql(q0).then(pres => {
      if(pres[0] && pres[0].author_id){
        const requestee_id = pres[0].author_id;
        const command = `INSERT INTO ModelRequests VALUES(
          "${model_id}",
          uuid(),
          "requested",
          "",
          "${requester_id}",
          "${requestee_id}",
          "${comment}"
        )`;
        execSql(command)
        .then(sqlres => {
          res.json({
            error: false,
            data: sqlres
          });
        }).catch(err => {
          if(err.code == 'ER_DUP_ENTRY'){
            res.json({
              error: true,
              message: err.code
            });
          } else {
            res.status(400).json({
              error: true,
              message: "SQL Error",
              data:err
            });
          }
        });
      } else {
        res.status(400).json({'message' : 'Invalid model selected'});
      }
    }).catch(err => {
      res.status(400).json({'message' : 'Query Failed'});
    })
  } else res.status(403).json({'message' : 'user not logged in'});
})

router.get('/api/req-model-status', (req, res) => {
  if(req.headers.authorization){
    let sqlres=[{}]
    const user = detokn(req.headers.authorization.split('Bearer ')[1]);
      let query = 'SELECT institution, group_read, group_write FROM Models inner join DfsUser on author_id=user_email WHERE model_id='+`"${req.query.model_id}"`;
      console.log(query)
          execSql(query)
          .then(sqlres2 => {
            if(user && user.user_email){
              query = 'SELECT institution FROM DfsUser WHERE user_email='+`"${user.user_email}"`;
      console.log(query)

              execSql(query)
              .then(sqlres3 => {
                if(sqlres2?.[0]?.['institution'] === sqlres3?.[0]?.['institution']){
                  sqlres[0]['group_read'] = sqlres2?.[0]?.['group_read'];
                  sqlres[0]['group_write'] = sqlres2?.[0]?.['group_write'];
                }
                if(sqlres[0]?.['group_read'] || sqlres[0]?.['group_write']){
                  res.json({
                    error: false,
                    data: sqlres
                  });
                }
                else{
                  query = 'SELECT * FROM ModelRequests ';
                  if(req.query.model_id) query += (`WHERE model_id="${req.query.model_id}" and requester_id="${user.user_email}"`)
                  else if(req.query.request_id) query += (`WHERE request_id="${req.query.request_id}"`)
                  else if(req.query.requester_id) query += (`WHERE requester_id="${req.query.requester_id}"`)
                  else if(req.query.requestee_id && user.user_email === req.query.requestee_id)
                    query += (`WHERE requestee_id="${req.query.requestee_id}"`)
                  else{
                    res.status(400).json({message : 'Can not retrieve specified model requests'}); return;
                  }
                  execSql(query)
                  .then(sqlres4 => {
                    res.json({
                      error: false,
                      data: sqlres4
                    });
                  })
                  .catch(err => {
                    res.status(400).json({
                      error: true,
                      message: "SQL Error",
                      data:[]
                    });
                  })
                }
              })
            }
            else{
              res.status(400).json({
                error: true,
                message: "Parsing error",
              });
            }
          })
  }
  else{
    res.status(400).json({
      error: true,
      message: "Parsing error",
    });
  }
});

router.post('/api/req-model-action', (req, res) => {
  if(req.headers.authorization){
    // console.log("inside")
    const user = detokn(req.headers.authorization.split('Bearer ')[1]);
    let query = 'SELECT * FROM ModelRequests ';
    if(req.query.model_id) query += (`WHERE model_id="${req.query.model_id}" and requester_id="${req.body.requester_id}"`)
    else{
      res.status(400).json({message : 'Can not retrieve specified model request'}); return;
    }
    execSql(query)
    .then(sqlres => {
      if(sqlres[0] && sqlres[0].requestee_id === user.user_email && req.body.request_status){
        if(req.body.permissions){
          query = `UPDATE ModelRequests SET request_status="${req.body.action}",request_for="${req.body.permissions}" WHERE model_id="${req.query.model_id}" and requester_id="${req.body.requester_id}"`;
        }
        else{
          query = `UPDATE ModelRequests SET request_status="${req.body.action}" WHERE model_id="${req.query.model_id}" and requester_id="${req.body.requester_id}"`;
        }
        execSql(query)
        .then(sqlres => {
          res.json({
            error: false,
            data: sqlres
          })
        }).catch(err => {
          res.status(400).json({
            error: true,
            data: err
          })
        });
      } else {
        res.status(401).json({
          error: false,
          message: 'Mismatch in user and model'
        });  
      }
    }).catch(err => {
      res.status(400).json({
        error: true,
        message: "SQL Error",
        data:err
      });
    });
  }

})
module.exports = router;