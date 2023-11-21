const sql = require('mysql2');
const SQL_INJ_ERROR="Potential sql injection"

const connectionParams = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  database: process.env.SQL_DATABASE || 'dfsdata',
}

const pool = process.env.USER === 'root' ?
  sql.createPool({...connectionParams, user: 'root'}) :
  sql.createPool({password: process.env.SQL_PASSWORD, ...connectionParams});

function execSql(statement, values) {
  return new Promise(function (res, rej) {
    if(statement.includes(';'))
    {
      console.log(statement);
      rej(SQL_INJ_ERROR);
    }
    pool.getConnection((err, con) => {
      if(err) rej(err);
      console.log("Connected to database");
      con.query(statement, values, function (err, result) {
        con.release();
        if (err) rej(err);
        else res(result);
      });
    })
  });
}

module.exports = {
  execSql,
  SQL_INJ_ERROR
}