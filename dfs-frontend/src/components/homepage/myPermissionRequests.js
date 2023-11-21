import { useEffect, useState } from "react";
import * as React from 'react';
import axios from "axios";
import creds from "../../creds";
const url= creds.backendUrl;

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c==='x' ? r :(r&(0x3|0x8))).toString(16);
  });
  return uuid;
}

async function setStatus(props) {
  console.log(props);
  // let res = 
  await axios({
    method: 'post',
    url: url + 'data-request-action',
    data: {
      request_id: props[0],
      approved_status: props[1]
    }
  });
  console.log("REQUEST SENDED TO AUTHOR ");
}

async function delReq(props) {
  console.log(props);
  // let res = 
  await axios({
    method: 'post',
    url: url + 'delete-request-action',
    data: {
      request_id: props[0]
    }
  });
  console.log("REQUEST SENDED TO AUTHOR ");
}

export default function MyRequests() {
  const [loading, setLoading] = useState(false);
  const [RequestData, setRequestData] = useState([]);
  var [status, setValue] = React.useState('Pending');
  const [ref, setRef] = useState(0);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    // change to headers, not a sercurity issue cuz of ssl, but needed
    axios.get(url + 'requests?token=' + JSON.parse(localStorage.getItem('dfs-user'))['token'])
    .then(res => {
      console.log('MYREQ', res);
      setRequestData(res.data);
      console.log("HERE");
    })
  }, [ref]);

  // "upfilename": "1659171950338_uploaderPage.js",
  // "upfilenameMD": "1659171953324_Screenshot from 2022-07-26 22-18-20.png",
  // "requester": "amey.kudari@students.iiit.ac.in",
  // "author": "amey.kudari@students.iiit.ac.in",
  // "stat": "requested",
  // "comment": "asdfasdf\nqwerqwer qwe\nasdf",
  // "av1": "BLANK"

  return (<>
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center justify-between">
        <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl" style={{fontWeight: '500'}}>My Requests</p>
      </div>
    </div>
    {/* <div className="flex items-center justify-between pb-6">
    <div className="col-md-4">
      <label className="relative inline-block px-3 py-1 font-semibold text-black -900 leading-tight">
      Status   {       }
      <select value={ status } onChange={handleChange}>
        <option className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight" value="Pending">Pending</option>
        <option className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight" value="Approved">Approved</option>
        <option className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight" value="Rejected">Rejected</option>
      </select>
      </label>
    </div>
    </div> */}
    <div>
      <div className="overflow-x-auto">
        {RequestData.length > 0 ? <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Requestee
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  File requested
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Comments
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{padding: '10px'}}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {RequestData.map((req, index) => (<tr index={'req' + index}>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap flex">
                    {req.author}
                  </p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap flex">
                    {req.upfilename}
                  </p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap flex">
                    {req.comment}
                  </p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  {req.stat}
                </td>
              </tr>))}
            </tbody>
          </table>
        </div> : <p>Your file access requests will appear here</p> }
      </div>
    </div>
  </>)
};
  