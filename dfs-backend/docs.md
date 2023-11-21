# Backend docs
*NOTE: Auth handled through headers*

---
## Datasets


### View Datasets
`/datasets`
*returns without data or files*

**Parameters:**
- `author_id`? : filter
- `public`? : filter
- `dataset_status`? : filter
- `dataset_name`? : name filter, `dataset_name` starts with
- `sort_by`? :     `dataset_id author_id dataset_name dataset_description public dataset_status`
- `ascending`? : `true|false`

---

## Data Requests

### View Data Requests
`/view-data-requests`
*View all data requests made from you based on the parameters*

**Parameters:**
- `request_id`? : filter
- `dataset_id`? : filter
- `dataset_version_id`? : filter,
- `requester_id`? : filter,
- `approved_status`? : filter,
- `sort_by`? : `request_id` `dataset_id` `dataset_version_id` `requester_id` `approved_status` `latest_status_change_date` `request_creation_date`
- `ascending`? : 'true|false'  # defaults to true


### Create Data Request

`/create-data-request` (POST)
*request view permission for a dataset*
**request body:**
- `dataset_version_id`
- `requester_id`
- `dataset_id`

### Data Request Actions
`/data-request-action` (POST)
**Parameters**
- `request_id`
- `approved_status`


---

## Models
### View Models
`/models`
*returns without data or files*

**Parameters**
- `author_id`? : filter
- `dataset_version_id`? : filter
- `group_id`? : filter
- `group_level2_id`? : filter
- `model_name`? : name filter, `model_name` starts with
- `sort_by`? :     `dataset_version_id model_id group_id author_id author_name dataset_name created_datetime last_updated dataset_status`
- `ascending`? : `true|false`

