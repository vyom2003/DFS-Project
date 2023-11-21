import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import download from 'js-file-download';
import ViewDatasetModal from "../datasets/viewDatasetModal";
import creds from "../../creds";
import unsecuredCopyToClipboard from "../../containers/copytoclipboard/copyTextClick";
const url = creds.backendUrl;


const m0p0 = {
  margin: '0px',
  padding: '0px'
}

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}


export default function MyDatasets({ copiedTimeoutId, copiedIndex, showCopied, setCopiedIndex, setShowCopied, setCopiedTimeoutId }) {


  const [modalProps, setmodalProps] = useState({
    modalActive: false,
    showFileDetailsModal: true,
    target: {}
  });
  const [loading, setLoading] = useState(false);
  const [datasetData, setDatasetData] = useState([]);
  const [tot, setTot] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    axios.get(url + 'dataset-versions-my?toVerify=1', {
      headers: {
        responseType: 'arraybuffer',
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
      }
    }).then(res => {
      let currUser = JSON.parse(localStorage.getItem('dfs-user'))?.user?.user_email
      res.data.data.forEach(element => {
        let ConvertDateEdit = new Date(parseInt(element.last_edit));
        let ConvertDateCreated = new Date(parseInt(element.created_date));
        element.last_edit = ConvertDateEdit.toLocaleDateString();
        element.created_date = ConvertDateCreated.toLocaleDateString();
        if (currUser === element.author_id) {
          element.verifcation = "verified";
        }
      });
      setDatasetData(res.data.data);
      setTot(parseInt(res.data.data.length));
    }).catch(err => {
    })
  }, [page]);

  return (<>
    <h1>My Dataset Versions</h1> <br />
    <div style={{ overflowX: 'auto' }}>
      {datasetData.length > 0 ? <table className="min-w-full leading-normal table-bordered table-striped">
        <thead>
          <tr>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Dataset Version id
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              version_name
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Format
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Last Edit
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Created Date
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {datasetData.map((data, index) => (<tr>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap flex" >
                <span title={data.dataset_version_id}>{data.databaseVersion_id.split('-')[0] + '-..'}</span> &nbsp;
                <svg className="w-5 h-5 cursor-pointer" fill={copiedIndex === "dataset_version_id_" + index && showCopied ? "green" : "currentColor"} x="0px" y="0px" width="20" height="20"
                  viewBox={copiedIndex === "dataset_version_id_" + index && showCopied ? "0 0 30 30" : "0 0 20 20"} xmlns="http://www.w3.org/2000/svg" onClick={() => { unsecuredCopyToClipboard(data.databaseVersion_id); clearTimeout(copiedTimeoutId); setShowCopied(true); setCopiedIndex("dataset_version_id_" + index); setCopiedTimeoutId(setTimeout(() => { setShowCopied(false) }, 3000)) }}>
                  {copiedIndex === "dataset_version_id_" + index && showCopied ? <path d="M 11.078125 24.3125 L 2.847656 15.890625 L 6.128906 12.53125 L 11.078125 17.597656 L 23.519531 4.875 L 26.796875 8.230469 Z M 11.078125 24.3125 "></path> :
                    <>
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                    </>}
                </svg>
              </p>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap" >{data.version_name}</p>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap" >
                {data.filetype}
              </p>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap" >
                {data.last_edit}
              </p>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap" >
                {data.created_date}
              </p>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap text-ellipsis" title={data.abstract} >
                {data.comments.slice(0, 20)}...
              </p>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm" >
              {data.verification === 'unverified' ? (
                <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                  <span aria-hidden className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
                  <span className="relative">Pending</span>
                </span>) : (data.verification === 'rejected' ? (
                  <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                    <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                    <span className="relative">Rejected</span>
                  </span>
                ) : (<span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                  <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                  <span className="relative">Approved</span>
                </span>))}

            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
              <button
                className="btn mt-1 btn-outline-info"
                onClick={() => {
                  setmodalProps(prevState => ({
                    ...prevState,
                    target: data,
                    modalActive: true,
                    showFileDetailsModal: true,
                  }));
                }}>
                View
              </button> &nbsp;
              {/* <button onClick={ () => {
                window.location.href = url+"download-latest?upfilename="+ data.upfilename + "&versionId="+data.databaseVersion_id + "&token=" + JSON.parse(localStorage.getItem("dfs-user"))["token"]
              }} className="btn btn-outline-danger">
                Download
              </button> */}
              <button className="btn mt-1 btn-outline-danger" onClick={() => {
                setmodalProps(prevState => ({
                  ...prevState,
                  target: data,
                  modalActive: true,
                  showFileDetailsModal: false,
                }));
              }}>
                Download
              </button>
            </td>
          </tr>))}
        </tbody>
      </table> : <p>Any dataset versions that you have add will appear here.</p>}
      <ViewDatasetModal
        show={modalProps.modalActive}
        onHide={() => setmodalProps(
          prevState => ({
            ...prevState,
            modalActive: false,
          })
        )}
        targetElement={modalProps.target}
        showFileDetails={modalProps.showFileDetailsModal}
      />
    </div>
  </>)
};