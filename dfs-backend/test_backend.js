const { execSql } = require("./db");

execSql('show tables').then(res => {
  console.log(res);
}).catch(err => {
  console.log("ERROR!!", err);
});