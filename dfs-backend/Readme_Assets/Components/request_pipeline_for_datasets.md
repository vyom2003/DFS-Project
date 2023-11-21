### Request Pipeline For Datasets

Dataset Request Schema:

![](../Imgs/DataRequest/Screenshot%20from%202022-12-14%2016-44-46.png)

The `approved_status` field shows the request status . It changes when the author updates the request.

Dataset Request Entry Entry:

An entry in the database looks like this.

![](../Imgs/DataRequest/Screenshot%20from%202022-12-14%2016-45-16.png)

A dataset can be downloaded when a user requests the dataset. A request is sent to the author of the dataset through the `model-request-pipeline`. 
The author can then `accept` / `reject` the request and on approval, the user can download the dataset and use it with some `terms and conditions
`. 

![](../Imgs/DataRequest/Screenshot%20from%202022-12-14%2016-47-07.png)