const express = require('express');
const router = express.Router();
const { execSql } = require('../db');

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c==='x' ? r :(r&(0x3|0x8))).toString(16);
  });
  return uuid;
}

function getJsonObject(result) {
  var data_result = [];
        for (entry of result) {
          var { 
            dataset_id,
            requester_id, 
            request_id, 
            dataset_version_id, 
            latest_status_change_date,
            request_creation_date,
            approved_status
          } = entry;
          
          var data = {
            'dataset_id': dataset_id,
            'requester_id': requester_id,
            'request_id': request_id,
            'dataset_version_id': dataset_version_id,
            'latest_status_change_date': latest_status_change_date,
            'request_creation_date': request_creation_date,
            'approved_status': approved_status
          }
          data_result.push(data);
        }

        return data_result;
}

router.post('/api/create-data-request', (req, res) => {
    var request_id = create_UUID();
    console.log("Response: ", req.body);
    var {requester_id,dataset_id,dataset_version_id}=req.body;
    const query = 'INSERT into DataRequests values ("'
    +request_id+'","'+dataset_id+'","'+dataset_version_id+'","'+requester_id+'","Pending","'+new Date().toISOString().slice(0, 19)+'","'+new Date().toISOString().slice(0, 19)+'")';
    console.log("query:",query)
    execSql(query).then(() => res.status(200));
    res.json({"Status":"New Request Generated"});
    // console.log(res.request_id);
})

module.exports = router