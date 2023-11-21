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
            approved_status,
            dataset_name,
            author_id
          } = entry;
          
          var data = {
            'dataset_id': dataset_id,
            'requester_id': requester_id,
            'request_id': request_id,
            'dataset_version_id': dataset_version_id,
            'latest_status_change_date': latest_status_change_date,
            'request_creation_date': request_creation_date,
            'approved_status': approved_status,
            'dataset_name' : dataset_name,
            'author_id' : author_id
          }
          data_result.push(data);
        }

        return data_result;
}

router.get('/api/view-data-requests', (req, res) => {

    // console.log("Request: ", req.query)
    var { requester_id, approved_status, dataset_version_id,request_creation_date,latest_status_change_date, sort_by, order } = req.query;
    // console.log(req.query)
    where_clauses = "";
    var empty = true;
    var first_clause = false;
    if (requester_id){
      empty = false;
      if (first_clause == false){
        first_clause = true
      }
      where_clauses += " requester_id='" + requester_id + "'";
    }
    
    if (approved_status){
      empty = false;
      if (first_clause == false){
        first_clause = true
      }
      else {
        where_clauses += " AND"
      }
      where_clauses += " approved_status='" + approved_status + "'";
    }
    
    if (dataset_version_id){
      empty = false;
      if (first_clause == false){
        first_clause = true
      }
      else {
        where_clauses += " AND"
      }
      where_clauses += " dataset_version_id='" + dataset_version_id + "'";
    }
    
    if (latest_status_change_date){
      empty = false;
      if (first_clause == false){
        first_clause = true
      }
      else {
        where_clauses += " AND"
      }
      where_clauses += " latest_status_change_date='" + latest_status_change_date + "'";
    }

    if (request_creation_date){
      empty = false;
      if (first_clause == false){
        first_clause = true
      }
      else {
        where_clauses += " AND"
      }
      where_clauses += " request_creation_date='" + request_creation_date + "'";
    }

    var no_where_clause = false
    if(sort_by && order){
      if(where_clauses == ""){
        no_where_clause = true
      }
      where_clauses += " ORDER BY " + sort_by + " " + order;
    }
    if (isEmpty(req.query)){
        const query = "SELECT * FROM DataRequests"
        execSql(query).then(result => {
          data = getJsonObject(result)
          res.json(data)
        })
    }
    else{
        if (no_where_clause){
          var query = "SELECT DataRequests.request_id, DataRequests.dataset_id, DataRequests.dataset_version_id ,DataRequests.requester_id, DataRequests.approved_status, DataRequests.latest_status_change_date, DataRequests.request_creation_date, Dataset.author_id, Dataset.dataset_name FROM DataRequests INNER JOIN Dataset ON DataRequests.dataset_id=Dataset.dataset_id " + where_clauses;
        }
        else {
          var query = "SELECT DataRequests.request_id, DataRequests.dataset_id, DataRequests.dataset_version_id ,DataRequests.requester_id, DataRequests.approved_status, DataRequests.latest_status_change_date, DataRequests.request_creation_date, Dataset.author_id, Dataset.dataset_name FROM DataRequests INNER JOIN Dataset ON DataRequests.dataset_id=Dataset.dataset_id WHERE" + where_clauses;
        }
        // console.log("QUERY: ", query);
        execSql(query).then(result => {
          data = getJsonObject(result)
          res.json(data)
          // console.log(data);
        }).catch(err => {
          console.log("ERROR!!", err);
        })
    }


})

module.exports = router