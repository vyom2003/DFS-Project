const { execSql } = require("../db");

function doesUserExist(email){
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM DfsUser WHERE user_email="${email}"`;
      execSql(query)
      .then(res => {
        console.log("inside execsql");
        if (res.length==0){
          reject({error: 'missmatched email'})
        }
        else {
          resolve(res[0]);
        }
      })
      .catch(err => {
        reject({error: 'missmatched email'});
      })
  })
};

module.exports = {
  doesUserExist,
}
