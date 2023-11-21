const express = require('express');
const router = express.Router();
const { execSql } = require('../db');

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
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

router.get('/api/checkreqexist', (req, res) => {
    var {requester_id,dataset_id,dataset_version_id}=req.query;
    execSql('select count(*) from datarequests where requester_id="'+requester_id+'" AND dataset_id="'+dataset_id+'" AND dataset_version_id="'+dataset_version_id+'"').then(result=>{
        console.log(result[0]["count(*)"]);
        res.send({'key':result[0]["count(*)"]})})
    // (() => res.status(200));
    
    // res.json({"Status":"Changes Made"});
})

module.exports = router