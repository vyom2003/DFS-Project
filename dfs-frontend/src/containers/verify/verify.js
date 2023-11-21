import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiSort, BiSortDown, BiSortUp } from "react-icons/bi";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import moment from "moment";

import creds from "../../creds";
import unsecuredCopyToClipboard from "../copytoclipboard/copyTextClick";
const url= creds.backendUrl;

const divStyle = {
  width: '90vw',
  background: 'white',
  padding: '1ch',
  borderRadius: '1ch',
  marginTop: '2rem',
  marginBottom: '2rem'
}

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Verify Dataset : {props.targetElement &&  props.targetElement.version_name} 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Details</h4>
        <table className="table table-striped w-full">
          <tr> <td>filetype </td> <td>{props.targetElement &&  props.targetElement.filetype}</td> </tr>
          <tr> <td>upfilename </td> <td><a href={url + "download?filename=" + (props.targetElement &&  props.targetElement.upfilename)} target="_blank">{props.targetElement &&  props.targetElement.upfilename}</a></td> </tr>
          <tr> <td>upfilenameMD </td> <td><a href={url + "download?filename=" + (props.targetElement &&  props.targetElement.upfilenameMD)} target="_blank">{props.targetElement &&  props.targetElement.upfilenameMD}</a></td> </tr>
          <tr> <td>databaseId </td> <td>{props.targetElement &&  props.targetElement.database_id}</td> </tr>
          <tr> <td>databaseVersionId </td> <td>{props.targetElement &&  props.targetElement.databaseVersion_id}</td> </tr>
          <tr> <td>comments </td> <td>{props.targetElement &&  props.targetElement.comments}</td> </tr>
          <tr> <td>version_name </td> <td>{props.targetElement &&  props.targetElement.version_name}</td> </tr>
          <tr> <td>reference </td> <td>{props.targetElement &&  props.targetElement.reference}</td> </tr>
          <tr> <td>created_date </td> <td>{props.targetElement &&  moment(Number(props.targetElement.created_date)).format("DD/MM/YYYY (on hh:mm:ss A)")}</td> </tr>
          <tr> <td>last_edit </td> <td>{props.targetElement &&  moment(Number(props.targetElement.last_edit)).format("DD/MM/YYYY (on hh:mm:ss A)")}</td> </tr>
          <tr> <td>publication_names </td> <td>{props.targetElement &&  props.targetElement.publication_names}</td> </tr>
          <tr> <td>publication_links </td> <td>{props.targetElement &&  props.targetElement.publication_links}</td> </tr>
          <tr> <td>public </td> <td>{props.targetElement &&  props.targetElement.public}</td> </tr>
          <tr> <td>verification </td> <td>{props.targetElement &&  props.targetElement.verification}</td> </tr>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Verify() {
  const [modalShow, setModalShow] = React.useState(false);
  const [forceref, setForceRef] = React.useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [targetElement, setTarget] = useState({});
  const [versionData, setVersionData] = useState([]);
  const [tot, setTot] = useState(0);
  const [page, setPage] = useState(0);
  const [datasetname_startswith, setSearchQ] = useState('');
  const [sort, setSort] = useState('dataset_name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [toVerify, setToVerify] = useState(false);
  const [copiedTimeoutId, setCopiedTimeoutId] = useState(-1);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [showCopied, setShowCopied] = useState(false);

  const sortFunction = key => {
    if(sort === key) {
      if(sortOrder === 'ASC') setSortOrder('DESC');
      else setSortOrder('ASC');
    } else setSort(key);
  }

  useEffect(() => {
    let turl = url + 'dataset-versions'
    if(!viewAll) turl = turl + '?toVerify=true';
    axios.get(turl).then(res=>{
      console.log("DATA", res);
      setVersionData(res.data.data.slice(page, page+5));
      console.log(res.data.data.length);
      setTot(parseInt(res.data.data.length));
    }).catch(err => {
      console.log("ERROR", err);
    })
  }, [toVerify, page, viewAll, forceref]);

  return (<>
    <div style={divStyle}>
    {/*  */}
    <div class="bg-white p-8 rounded-md w-full">
    <div className="flex items-center justify-between pb-6">
      <div className="items-center justify-between">
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl md-0">Dataset Versions Pending Actions</p> <br />
        {/* <p className="mt-2 text-1xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-1xl w-px-200"> {dataset_id} </p> */}
      </div>
      <div class="flex bg-gray-50 items-center p-2 rounded-md">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
					fill="currentColor">
					<path fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd" />
				</svg>
				<input class="bg-gray-50 outline-none ml-1 block " type="text" value={datasetname_startswith} onChange={e=>setSearchQ(e.target.value)} placeholder="search..." />
      </div>
    </div>
    <input type='checkbox' value={viewAll} onChange={()=>{setViewAll(!viewAll);setPage(0)}}/> <label> &nbsp; &nbsp;View all datasets</label>
    <div>
      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick = {() => sortFunction('dataset_id')}>
                  Version id {sort === 'dataset_id' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right"/> }
                </th>
                <th
                  className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick = {() => sortFunction('dataset_name')}>
                  Version_name {sort === 'dataset_name' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right"/> }
                </th>
                <th
                  className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick = {() => sortFunction('public')}>
                  Version Format {sort === 'public' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right"/> }
                </th>
                <th
                  className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick = {() => sortFunction('source')}>
                  Last Edit {sort === 'source' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right"/> }
                </th>
                <th
                  className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick = {() => sortFunction('dataset_status')}>
                  Created Date {sort === 'dataset_status' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right"/> }
                </th>
                <th
                  className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick = {() => sortFunction('dataset_description')}>
                  Description {sort === 'dataset_description' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right"/> }
                </th>
                <th
                  className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {versionData.map((data, index) => (<tr>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap flex">
                  <span title={data.dataset_version_id}>{data.databaseVersion_id.split('-')[0] + '-..'}</span> &nbsp;
                    <svg className="w-5 h-5 cursor-pointer" fill={copiedIndex==="dataset_version_id_"+index && showCopied ? "green" : "currentColor"} x="0px" y="0px" width="20" height="20"
                      viewBox={copiedIndex==="dataset_version_id_"+index && showCopied ? "0 0 30 30" : "0 0 20 20"} xmlns="http://www.w3.org/2000/svg" onClick={() => {unsecuredCopyToClipboard(data.databaseVersion_id);clearTimeout(copiedTimeoutId);setShowCopied(true);setCopiedIndex("dataset_version_id_" + index);setCopiedTimeoutId(setTimeout(()=> {setShowCopied(false)},3000))}}>
                      {copiedIndex==="dataset_version_id_"+index && showCopied ? <path d="M 11.078125 24.3125 L 2.847656 15.890625 L 6.128906 12.53125 L 11.078125 17.597656 L 23.519531 4.875 L 26.796875 8.230469 Z M 11.078125 24.3125 "></path> :
                      <>
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                      </>}
                    </svg>
                  </p>
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  <span className="text-gray-900 whitespace-no-wrap">{data.version_name}</span>
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  <span className="text-gray-900 whitespace-no-wrap">
                    {data.filetype}
                  </span>
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  <span className="text-gray-900 whitespace-no-wrap">
                    {moment(Number(data.last_edit)).format("DD/MM/YYYY (on hh:mm:ss A)")}
                  </span>
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  <span className="text-gray-900 whitespace-no-wrap">
                    {moment(Number(data.created_date)).format("DD/MM/YYYY (on hh:mm:ss A)")}
                  </span>
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  <span className="text-gray-900 whitespace-no-wrap text-ellipsis" title={data.abstract}>
                    {data.comments.slice(0,20)}...
                  </span>
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm flex">
                  <button 
                    className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded"
                    onClick={() => {setTarget(data); setModalShow(true);}}>
                    View
                  </button>
                  {data.verification !== 'verified' && <button 
                    className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded ml-1"
                    onClick={() => {
                      console.log(data.upfilename);
                      axios.post(url + 'fileverify',
                      {
                        upfilename: data.upfilename
                      },{
                        headers: {
                          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
                        }
                      })
                      .then(res=>{
                        console.log(res);
                        setForceRef(1 - forceref);
                      })
                    }}>
                    Approve
                  </button>}
                  {data.verification !== 'rejected' && <button 
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded ml-1 mr-2"
                    onClick={() => {
                      console.log(data.upfilename);
                      axios.post(url + 'filereject',
                      {
                        upfilename: data.upfilename
                      },{
                        headers: {
                          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
                        }
                      })
                      .then(res=>{
                        console.log(res);
                        setForceRef(1 - forceref);
                      })
                    }}>
                    Reject
                  </button>}
                  {/* <button className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded ml-1 p-4" onClick={()=>this.props.history.push(`/dataset-versions?dataset_id=` + data.dataset_id)}>
                  <FiExternalLink/>
                  </button> */}
                  {/* // </button> */}
                </td>
              </tr>))}
            </tbody>
          </table>
          <div
            className="px-3 py-3 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
            <span className="text-xs xs:text-sm text-gray-900">
              Showing {page + 1} to {Math.min(tot,page + 5)} of {tot} Entries
            </span>
            <div className="flex mt-2 xs:mt-0">
              <button
                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l disabled:opacity-50"
                onClick={() => setPage(Math.max(0, page-5))}
                disabled={page === 0}
              >
                Prev
              </button>
              &nbsp; &nbsp;
              <button
                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r disabled:opacity-50"
                onClick={() => { if(page+5 !== tot) setPage(Math.min(tot, page+5));}}
                disabled={page + 5 >= tot}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        targetElement={targetElement}
      />

    </div>
  </>)
};


// setversionData([{
//   dataset_id : create_UUID(),
//   dataset_name : 'MovieLens',
//   public : true,
//   source : 'MovieLens',
//   dataset_status : 'Active',
//   dataset_description : 'MovieLens dataset is very popular dataset with loads of movies'
// },{
//   dataset_id : create_UUID(),
//   dataset_name : 'Amazon Forest',
//   public : false,
//   source : 'USAF',
//   dataset_status : 'USAF',
//   dataset_description : 'Data of all trees in amazon forest aged more than 100 years'
// },{
//   dataset_id : create_UUID(),
//   dataset_name : 'Amazon Rainforest',
//   public : true,
//   source : 'USAF',
//   dataset_status : 'Accepted',
//   dataset_description : 'Data of all trees in amazon rain forest aged more than 100 years'
// },{
//   dataset_id : create_UUID(),
//   dataset_name : 'Desert sand',
//   public : true,
//   source : 'IAF North',
//   dataset_status : 'Active',
//   dataset_description : 'Sand quality across the entire Thar desert evaluated'
// },{
//   dataset_id : create_UUID(),
//   dataset_name : 'Rain in Delhi',
//   public : true,
//   source : 'IAF North',
//   dataset_status : 'Active',
//   dataset_description : 'Rain levels throughout the year in Delhi'
// }]);

