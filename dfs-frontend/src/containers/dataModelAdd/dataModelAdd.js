import axios from "axios";
import React, { useEffect, useState, useContext } from "react"
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./bootstrap.min.css";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { isVersionId, isPartialVersionId } from "../../utils";
import creds from "../../creds";
const url = creds.backendUrl;

// const axiosInstance = axios.create({ baseURL: "http://10.4.25.20:3001/" });
function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
const form_class = "w-2/3 align-end px-4 py-4 mx-4 my-4 border border-solid border-current rounded-lg bg-white shadow-2xl"

const axiosInstance = axios.create({ baseURL: url});


//     "dataset_id": "2328710d-e0c6-4fa8-b28a-265b4b6fa7d1",
//     "author_id": "amey.kudari@students.iiit.ac.in",
//     "reference_list": "https://dl.acm.org/doi/abs/10.1145/2827872,https://dl.acm.org/doi/fullHtml/10.1145/3458723",
//     "dataset_name": "Thar Desert Rain",
//     "dataset_description": "Rainfall statistics recorded across multiple regions and large timeframes in the Thar desert",
//     "public": 1,
//     "source": "IAF",
//     "dataset_data": null,
//     "dataset_format": "csv",
//     "temporary": 1,
//     "dataset_status": "REJECTED",
//     "domain": "Wildlife"





export default function AddDataModel() {
  const [model_id, setDataModelID] = useState(create_UUID());
  const authorId = JSON.parse(localStorage.getItem('dfs-user'))['user']['user_email'];
  const [dataset_id, setDatasetId] = useState('');
  const [dataset_version_id, setDatasetVersionId] = useState('');
  const [authorName, setauthorName] = useState('');
  const [model_name, setmodelName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [searchq, setSearchq] = useState('');
  const [domainLst, setDomainLst] = useState([]);
  const [group_id, setGroupId] = useState('');
  const [domain, setDomain] = useState(''); // set existing domain for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [upfilename, setupfilename] = useState('');
  const [progress, setProgress] = useState();
  const [ModelFile, setModelFile] = useState([]);
  const [UploadDate, setUploadDate] = useState('');
  const [isModelUploaded, setModelUploaded] = useState(0);
  const [isReadChecked, setIsReadChecked] = useState(false);
  const [isWriteChecked, setIsWriteChecked] = useState(false);
  const [errMsg, setErrMsg] = useState(1);

  const handleReadChecked = () => {
    setIsReadChecked(!isReadChecked);
  };
  const handleWriteChecked = () => {
    setIsWriteChecked(!isWriteChecked);
  };
  const navigate = useNavigate();

  const { addToast } = useContext(ToastContext);
  
  useEffect(() => {
    axios.get(url + 'domains', {
      params : {searchq}, 
    })
    .then(res=>{
      console.log(res);
      setDomainLst(res.data.data);
    });
  },[searchq])

  const uploadFile = (e) => {
    setupfilename('');
    let formData = new FormData();
    formData.append("file", ModelFile[0]);
    setModelUploaded(1);
    axiosInstance
      .post("/upload_model", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setProgress(Math.round(100 * (data.loaded / data.total)));
        },
      }).then(res=>{
        setupfilename(res.data.filename);
      })
      .catch((error) => {
        const code = error?.response?.data?.code;
        switch (code) {
          case "FILE_MISSING":
            setError("Please select a file before uploading");
            break;
          case "LIMIT_FILE_SIZE":
            setError("File size is too large. Please upload files below 1GB!");
            break;
          case "INVALID_TYPE":
            setError(
              "This file type is not supported. Only .png, .jpg, and .jpeg files are allowed"
            );
            break;
          default:
            setError("Sorry, something went wrong");
            break;
        }
      });
  };

  const sqlsubmit = (e) => {
    e.preventDefault();
    if(isModelUploaded && model_id && dataset_id && dataset_version_id && errMsg === 2 &&
      authorName && authorId && model_name && groupName &&
      group_id && domain && UploadDate){
      axiosInstance.post("/add-model", {
        model_id,
        dataset_id,
        dataset_version_id,
        authorName,
        authorId,
        model_name,
        groupName,
        group_id,
        domain,
        UploadDate,
        upfilename,
        isReadChecked,
        isWriteChecked
      },
      {
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
        }
      })
      .then(res => {
        if(res.data.error){
          addToast({
            message: "File is already uploaded",
            variant: TOAST_VARIANTS.WARNING
          })
        } else {
          addToast({
            message: "File successfully uploaded",
            variant: TOAST_VARIANTS.SUCCESS
          })
        }
      }).catch(err => {
      })
    } else {
      e.preventDefault();
      addToast({
        message: "Please fill all the form details",
        variant: TOAST_VARIANTS.WARNING
      })
    }
  }
  const checkVer = (data) => {
    var err_check = true;
    var par_len = 0;
    const regex = /^([0-9\b]+$)/;
    const verId = data;
    const parts = verId.split('-');
    setDatasetVersionId(data);
    parts.forEach((part) => {
        if(part.length > 0){
          err_check = regex.test(part) & err_check;
          par_len = par_len + 1;
        }
    })
    if(err_check && (parts.length < 3 || (parts.length === 3 && par_len <= 2))){
      setErrMsg(1);
    }
    else if(err_check && parts.length === 3 && par_len === 3){
      setErrMsg(2);
    }
    else{
      setErrMsg(0);
    }
  }
  return (
    <Container className= {form_class} >
      <form onSubmit={sqlsubmit}>
        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example1">Model Id (space to reassign id): </label>
          <input 
            value={model_id}
            className={model_id === "" ? "form-control" : "form-control bg-slate-50"}
            disabled
            />
        </div>
        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">Dataset Id: </label>
          <input 
            value={dataset_id}
            className={dataset_id === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>setDatasetId(e.target.value)}
            />
        </div>

        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">
            <p>
              <span>Dataset Version Id: <small>In format: (number-number-number)</small></span>
            </p>
          </label>
          <input 
            value={dataset_version_id}
            className={dataset_version_id === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>setDatasetVersionId(currVal => isPartialVersionId(e.target.value) || isVersionId(e.target.value) ? e.target.value : currVal)}
            // if(isVersionId(e.target.value)), add a green outline to it. OnBlur, if it is not, then make it a red outline
            // actively check for isVersionId on every keydown and set to green outline / red outline. Enable this after an onBlur event is triggered.
          />
        </div>
          <div className="text-blue-500 -mt-4">**Note- Format is number-number-number</div>
        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">Author Name: </label>
          <input 
            value={authorName}
            className={authorName === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>setauthorName(e.target.value)}
            />
        </div>
        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">Author Id: </label>
          <input 
            value={authorId}
            className={authorId === "" ? "form-control" : "form-control bg-slate-50"}
            disabled
            />
        </div>


        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">Model Name: </label>
          <input 
            value={model_name}
            className={model_name === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>setmodelName(e.target.value)}
            placeholder='Enter Model Name'
            />
        </div>
        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">Group: </label>
          <input 
            value={groupName}
            className={groupName === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>setGroupName(e.target.value)}
            placeholder='Enter Group Name'
            />
        </div>


        <div className="flex mb-6">
            <div class="flex items-center mr-4">
                <input id="inline-checkbox1" type="checkbox" value="" className="mb-1 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={isReadChecked} onChange={handleReadChecked}></input>
                <label for="inline-checkbox1" class="mt-1 ml-2 text-gray-900 dark:text-gray-300">Grant Read permission to group members</label>
            </div>
            <div class="flex items-center ml-10">
                <input id="inline-checkbox2" type="checkbox" value="" className="mb-1 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={isWriteChecked} onChange={handleWriteChecked}></input>
                <label for="inline-checkbox2" class="mt-1 ml-2 text-gray-900 dark:text-gray-300">Grant Write permission to group members</label>
            </div>
        </div>

        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">Group Id: </label>
          <input 
            value={group_id}
            className={group_id === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>setGroupId(e.target.value)}
            placeholder='Enter Group Id'
            />
        </div>

        <div className="form-outline mb-6">
          <label className="form-label text-base" for="form2Example2">Domain: </label>
          <select 
            value={domain}
            className={domain === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>{setDomain(e.target.value)}}
            >
            <option value=''></option>
            {domainLst.map((domain,key) => (
              <option value={domain.domain}> {domain.domain}</option>
            ))}
          </select>
        </div>
        <Form>
          <Form.Group controlId="formFile" className="mb-6">
          <label className="form-label text-base" for="form2Example2">Created Date and Time: </label>
          <input 
            type = "date"
            value={UploadDate}
            className={UploadDate === "" ? "form-control" : "form-control bg-slate-50"}
            onChange={e=>{setUploadDate(e.target.value);}}
            placeholder='DD-MM-YYYY'
            />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">

              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Select Model File</label>
              <input 
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
              id="file_input" type="file"
              onChange={(e) => setModelFile(e.target.files)}
              />
          </Form.Group>
          <Form.Group className="mb-6">
            <Button variant="primary" onClick={uploadFile}>
              Upload
            </Button>
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          {!error && progress && upfilename.length == 0 && (
            <ProgressBar now={progress} label={`${progress}%`} />
          )}
          {upfilename.length > 0 && <p>Uploaded successfully : <b>{upfilename}</b></p> }
        </Form>
            <hr/>
          <div className="text-right">
        <button type="submit" className=" btn btn-primary mb-10 justify-center text-btn">Add Model</button>
          </div>

      </form>
    </Container>
  )
};
