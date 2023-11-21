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

router.post('/api/data-request-action', (req, res) => {
    console.log("Response: ", req.body);
    var {request_id,approved_status}=req.body;
    execSql('UPDATE DataRequests SET approved_status="'+approved_status+'" , latest_status_change_date="'+ new Date().toISOString().slice(0, 19)+'" WHERE request_id="'+request_id+'"').then(() => res.status(200));

    res.json({"Status":"Changes Made"});
})

module.exports = router