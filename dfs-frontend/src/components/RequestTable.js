import { PaperClipIcon, DownloadIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import axios from "axios";

const tdstyle={
  margin: '0px',
  padding: '0px'
}

var reqid;
const backendAPI = 'http://localhost:3001/';
// var ReqID;
// changereqstatus = async (status, reqid) =>
//  {
//   await axios({
//     method: 'post',
//     url: backendAPI + 'changestatus',
//     data: {
//       status: status,
//       reqid: reqid
//     }
//   });
//   console.log(status," ",reqid);
// };
async function changereqstatus(props) {
  let userid = localStorage.getItem('userid');
  let res = await axios({
    method: 'post',
    url: backendAPI + 'changestatus',
    data: {
      
      status: props,
      reqid: reqid
    }
  });
}
export default function RequestTable(props) {
    
    const reqs = props.reqs;
    

    return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg no-scrollbar px-10">
    <table className="w-full text-md text-center text-gray-500 table-auto">
      <thead className="text-xs text-white uppercase bg-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Request ID
          </th>
          <th scope="col" className="px-6 py-3">
            Dataset ID
          </th>
          <th scope="col" className="px-6 py-3">
            Request from
          </th>
          <th scope="col" className="px-6 py-3">
            Author ID
          </th>
          <th scope="col" className="px-6 py-3">
            Status
          </th>
          <th scope="col" className="px-6 py-3">
            Date
          </th>
          <th scope="col" className="px-6 py-3">
            
          </th>
          <th scope="col" className="px-6 py-3">
          
          </th>
        </tr>
      </thead>
      <tbody>
        
        {
        
        reqs.map(ver =>
          
          <tr className="bg-white border-b hover:bg-gray-50">
            
            <td className="font-lg" style={tdstyle}>
            <Link
              to="/"
              state={{ 'ReqID': ver["ReqID"]}}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-200"
            >
              {ver["ReqID"]}
            </Link>

            </td>
            <td className="px-6 py-4 font-lg" style={tdstyle}>
              {ver["database_id"]}
            </td>

            <td className="px-6 py-4 font-lg" style={tdstyle}>
              {ver["request_from"]}
            </td>

            <td className="px-6 py-4 font-medium text-gray-900" style={tdstyle}>
              {ver["AuthorID"]}
            </td>

            <td className="px-6 py-4" style={tdstyle}>
              <div className="overflow-hidden hover:overflow-auto max-h-40 no-scrollbar">
              {ver["Status"]}
              </div>
            </td>

            <td className='' style={tdstyle}>
              {ver["Published"]}
            </td>
            {ver["Status"] === "PENDING" ? 
            <p><div className="inline-flex rounded-md shadow">
                <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-success-color-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
                    reqid=ver["ReqID"];
                    changereqstatus("APPROVED")
                  }}>Accept</button>
                </div>
                <div className="inline-flex rounded-md shadow">
                <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-danger-color-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
                    reqid=ver["ReqID"];
                    changereqstatus("REJECTED")
                  }}>Reject</button>
                </div></p> : 
            <p> </p>}
            {/* {ver["Status"]="PENDING"?
            (<div className="inline-flex rounded-md shadow">
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-success-color-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
                  reqid=ver["ReqID"];
                  changereqstatus("APPROVED")
                }}>Accept</button>
              </div>
              <div className="inline-flex rounded-md shadow">
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-danger-color-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
                  reqid=ver["ReqID"];
                  changereqstatus("REJECTED")
                }}>Reject</button>
              </div>
            ):
              {

              } */}
            
          </tr>
        )
        
        }
       
      </tbody>
    </table>
  </div>
    )
}