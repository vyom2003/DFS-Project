const { execSql } = require('./db');

execSql('show tables').then(res => {
  console.log(res);
})