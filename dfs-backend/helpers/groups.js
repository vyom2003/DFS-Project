const { execSql } = require("../db");

function doesGroupExist(group_id){
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM DatasetGroups WHERE group_id="${group_id}"`;
      execSql(query)
      .then(res => {
        if (res.length==0){
          reject({error: 'missmatched group_id'})
        }
        else {
          resolve(res[0]);
        }
      })
      .catch(err => {
        reject({error: 'missmatched group_id'});
      })
  })
};

function doesGroupAdminExist(group_id, user_email){
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM DatasetGroups WHERE group_id="${group_id}" AND user_id="${user_email}" AND user_role="CREATOR"`;
      execSql(query)
      .then(res => {
        if (res.length==0){
          reject({error: 'missmatched group_id'})
        }
        else {
          resolve(res[0]);
        }
      })
      .catch(err => {
        reject({error: 'missmatched group_id'});
      })
  })
};

function doesGroupMemberExist(group_id, user_email){
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM DatasetGroups WHERE group_id="${group_id}" AND user_id="${user_email}"`;
      execSql(query)
      .then(res => {
        if (res.length==0){
          reject({error: 'missmatched group_id'})
        }
        else {
          resolve(res[0]);
        }
      })
      .catch(err => {
        reject({error: 'missmatched group_id'});
      })
  })
};

function isGroupNameNew(group_name, user_id){
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM DatasetGroups WHERE group_name="${group_name}" AND user_id="${user_id}"`;
    execSql(query)
    .then(res => {
      if (res.length>0){
        reject({error: 'missmatched group_id'})
      }
      else {
        resolve(res);
      }
    })
    .catch(err => {
      reject({error: 'missmatched group_id'});
    })
})

}

module.exports = {
  doesGroupExist,
  doesGroupAdminExist,
  doesGroupMemberExist,
  isGroupNameNew
}
