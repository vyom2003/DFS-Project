const express = require('express');
const router = express.Router();
const { execSql } = require('../../db');
const { detokn } = require('../auth/utils');

router.post('/api/add-domain', (req, res) => {
  if(req.headers.authorization){
    const user = detokn(req.headers.authorization.split('Bearer ')[1])
    if(user?.user_role === 'admin'){
      let query = `INSERT INTO Domain VALUES (
        '${req.body.domain}',
        '${req.body.publication_links}',
        '${req.body.publication_names}',
        '${req.body.publication_format}',
        '${req.body.abstract_a}',
        '${req.body.abstarct_b}',
        '${req.body.abstract_c}',
        '11-04-14'
      )`;
      console.log('QUERY\n', query, '\n||');
      execSql(query)
      .then(sqlres => {
        res.json({
          error: false,
          data: sqlres
        });
      }).catch(err => {
        console.log(err.code);
        if(err.code == 'ER_DUP_ENTRY'){
          res.json({
            error: true,
            message: err.code
          });
        } else {
          console.log("400 error", err);
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data:err
          });
        }
      });
    } else res.status(401).json({error: true, message: 'Invalid token'});
  } else {
    res.status(401).json({error: true, message: 'Invalid token'});
  }
})

router.post('/api/edit-domain', (req, res) => {
  if(req.headers.authorization){
    const user = detokn(req.headers.authorization.split('Bearer ')[1])
    if(user?.user_role === 'admin'){
      console.log(req.body)
      let query = `UPDATE Domain SET
        publication_links='${req.body.publication_links}',
        publication_names='${req.body.publication_names}',
        publication_format='${req.body.publication_format}',
        abstract_a='${req.body.abstract_a}',
        abstarct_b='${req.body.abstarct_b}',
        abstract_c='${req.body.abstract_c}',
        last_addition='11-04-14'
        WHERE domain='${req.body.domain}'
      `;
      console.log('QUERY\n', query, '\n||');
      execSql(query)
      .then(sqlres => {
        res.json({
          error: false,
          data: sqlres
        });
      }).catch(err => {
          console.log("400 error", err);
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err
          });
      });
    } else res.status(401).json({error: true, message: 'Invalid token'});
  } else {
    res.status(401).json({error: true, message: 'Invalid token'});
  }
})

router.post('/api/delete-domain', (req, res) => {
  console.log("HERE");
  if(req.headers.authorization){
    const user = detokn(req.headers.authorization.split('Bearer ')[1])
    const domain = req.body.domain;
    if(user?.user_role === 'admin' && domain){
      const query = `DELETE FROM Domain WHERE domain='${domain}'`;
      console.log('QUERY\n', query, '\n||');
      execSql(query)
      .then(sqlres => {
        res.json({
          error: false,
          data: sqlres
        });
      }).catch(err => {
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data:err
        });
      });
    } else {
      res.status(401).json({error: true, message: 'Invalid token'});
    }
  } else res.status(401).json({error: true, message: 'Invalid token'});
});

router.get('/api/domains', (req, res) => {
  var { searchq } = req.query;
  let query = "SELECT * FROM Domain " + (searchq.length ? "WHERE domain LIKE '" + searchq + "%'" : "") + "ORDER BY last_addition" 
  execSql(query)
  .then(result => res.json({error: false, data: result}))
  .catch(err => res.json({error: true, data: err}));
});

module.exports = router
