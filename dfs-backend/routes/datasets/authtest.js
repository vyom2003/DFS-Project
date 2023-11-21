const express = require('express');
const router = express.Router();
const { execSql } = require('../../db');
const fs = require('fs');

const { detokn } = require('../auth/utils.js');

router.post('/api/authtest', (req, res) => {
  console.log(req.body.headers);
  console.log(detokn('asdfasdf'));
  res.json(1);
});

module.exports = router;