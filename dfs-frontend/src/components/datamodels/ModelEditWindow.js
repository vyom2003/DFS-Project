import React, { useState, useContext } from "react";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  ProgressBar,
  Alert
} from "react-bootstrap";
import { url } from '../../creds';
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";

const axiosInstance = axios.create({ baseURL: url});


export default function ModelEditWindow(props) {
    const [error, setError] = useState();
    const [upfilename, setupfilename] = useState('');
    const [progress, setProgress] = useState();
    const [ModelFile, setModelFile] = useState([]);
    const [isModelUploaded, setModelUploaded] = useState(0);
    const [model_id, setModelId] = useState('');

    const { addToast } = useContext(ToastContext);

    // const [ModelFile, setModelFile] = useState([]);
    console.log("TARGET ELEMENT", props.targetElement);
    // useEffect(()=>{
    const uploadFile = (e) => {
      e.preventDefault();
      setupfilename('');
      console.log("inside upload file");
      let formData = new FormData();
      formData.append("file", ModelFile[0]);
      console.log("file = ",ModelFile[0])
      console.log("formData = ",formData);
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
          setModelId(props.targetElement?.model_id);
        })
        .catch((error) => {
          console.log(error);
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

    const submitEdit = () => {
      if(isModelUploaded){
        axiosInstance.post("/edit-model-json", {
          upfilename,
          model_id
        },
        {
          headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
          }
        })
        .then(res => {
          console.log(res);
          if(res.data.error){
            addToast({
              message: "File is already uploaded",
              variant: TOAST_VARIANTS.WARNING
            })
          } else {
            addToast({
              message: "Model Updated Successfully!",
              variant: TOAST_VARIANTS.SUCCESS
            })
          }
        }).catch(err => {
          console.log("UPLOAD ERROR", JSON.stringify(err));
          addToast({
            message: "UPLOAD ERROR",
            variant: TOAST_VARIANTS.ERROR
          })
        })
      } else {
        addToast({
          message: "Please fill all the form details",
          variant: TOAST_VARIANTS.WARNING
        })
      }
    };
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Model : {props.targetElement &&  props.targetElement.version_name} 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4>Details</h4> */}
          <table className="table table-striped">
          {/* SSL will protect the query parameters in transit, hence passing token in params only */}
            <tr> <td>Model Id </td> <td>{props.targetElement &&  props.targetElement.model_id}</td> </tr>
            <tr> <td>Model Name </td> <td>{props.targetElement &&  props.targetElement.model_name}</td> </tr>
            <tr>
              <td>Upload New File</td>
              <td>
              <Form onSubmit={uploadFile}>
              <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                type="file"
                onChange={(e) => {setModelFile(e.target.files)}}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {!error && progress && upfilename.length == 0 && (
              <ProgressBar now={progress} label={`${progress}%`} />
            )}
            {upfilename.length > 0 && <p>Uploaded successfully : <b>{upfilename}</b></p> }
              </Form>
              </td>
            </tr>
          </table>
          
        </Modal.Body>
        <Modal.Footer>
        <button className="btn btn-primary float-right mr-10 mb-10" type="submit" onClick = {submitEdit} >Add Model</button>
        </Modal.Footer>
      </Modal>
    );
  }