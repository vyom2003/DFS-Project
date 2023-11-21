import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AiOutlineUpload } from 'react-icons/ai';
import unsecuredCopyToClipboard from "../../containers/copytoclipboard/copyTextClick";
// import "./styles.css";
import creds from "../../creds";
const url= creds.backendUrl;


const shortenDesc = desc => {
  if(desc.length > 40){
    return desc.slice(37) + '...';
  } return desc;
}

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
export default function MyModels({copiedTimeoutId,copiedIndex,showCopied,setCopiedIndex,setShowCopied,setCopiedTimeoutId}) {
  const [loading, setLoading] = useState(false);
  const [datasetData, setDatasetData] = useState([]);

  useEffect(() => {
    axios.get(url + 'datasets-my?toVerify=1', {                        
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
      }
    }).then(res=>{
      let page = 0;
      console.log("DATASETS_MY", res);
      // setDatasetData(res.data.data.slice(page, page+5));
      setDatasetData(res.data.data);
      // setTot(parseInt(res.data.data.length));
    }).catch(err => {
      console.log("ERROR", err);
    })
  }, []);

  return (<>
    <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr'}}>
      <h1>My Datasets</h1>
      <Link to='/add-dataset' style={{justifySelf: 'flex-end'}}>
        <button className='btn btn-primary mr-3'>
            <AiOutlineUpload size={30}/>
        </button>
      </Link>
    </div>
    <br />
    <div style={{overflowX: 'auto', overflowY: 'auto', maxHeight: '80vh', paddingBottom: '2px'}}>
      {datasetData.length > 0 ? <table className="min-w-full leading-normal table-bordered">
        <thead>
          <tr>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              dataset_id
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              dataset_name
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              dataset_description
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              domain
            </th>
            <th
              className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {datasetData.map((data, index) => (<tr>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm max-w-1/5">
              <span className="text-gray-900 whitespace-no-wrap flex">
              <span title={data.dataset_id}>{data.dataset_id.split('-')[0] + '-..'}</span> &nbsp;
                <svg className="w-5 h-5 cursor-pointer" fill={copiedIndex==="dataset_id_"+index && showCopied ? "green" : "currentColor"} x="0px" y="0px" width="20" height="20"
                  viewBox={copiedIndex==="dataset_id_"+index && showCopied ? "0 0 30 30" : "0 0 20 20"} xmlns="http://www.w3.org/2000/svg" onClick={() => {unsecuredCopyToClipboard(data.dataset_id);clearTimeout(copiedTimeoutId);setShowCopied(true);setCopiedIndex("dataset_id_"+index);setCopiedTimeoutId(setTimeout(()=> {setShowCopied(false)},3000))}}>
                  {copiedIndex==="dataset_id_"+index && showCopied ? <path d="M 11.078125 24.3125 L 2.847656 15.890625 L 6.128906 12.53125 L 11.078125 17.597656 L 23.519531 4.875 L 26.796875 8.230469 Z M 11.078125 24.3125 "></path> :
                  <>
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                  </>}
                </svg>
              </span>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm max-w-1/5">
              <span className="text-gray-900 whitespace-no-wrap">{data.dataset_name}</span>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm max-w-1/5">
              <span className="text-gray-900 whitespace-no-wrap">{shortenDesc(data.dataset_description && data.dataset_description.split('Π')[0])}</span>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm max-w-1/5">
              <span className="text-gray-900 whitespace-no-wrap">{data.domain}</span>
            </td>
            <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm flex">
            <Link to={'/dataset-versions/' + data.dataset_id}>
              <button className="btn btn-outline-info">
                View
              </button>
            </Link>
            &nbsp;
            <Link to={'/fileupload/' + data.dataset_id + '/' + data.dataset_name}>
              <button className="btn btn-outline-danger">
                Add
              </button>
            </Link>
            </td>
          </tr>))}
        </tbody>
      </table> : <p>Datasets you add will appear here</p>}
      {/* <br /> */}
    </div>
  </>)
};
  