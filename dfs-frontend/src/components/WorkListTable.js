import { PaperClipIcon, DownloadIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react"
import axios from "axios";

const backendAPI = 'http://localhost:3001/';
var items;
async function requestDatabaseAccess(props) {
  let userid = localStorage.getItem('userid');
  let res = await axios({
    method: 'post',
    url: backendAPI + 'request',
    data: {
      data: items,
      id: props,
      userid: userid
    }
  });
  //localStorage.clear();
}
export default function VersionTable(props) {
    items = props.items;
    let userid = localStorage.getItem('userid');
    const haveaccess = false;
    function PrivateDataset(props) {
      if (props === "1") {
        return true;
      }
      return false;
    }
    
    // let dataid = localStorage.getItem('dataid');
    // async function setdataidState(dataid = null) {
    //   localStorage.setItem('dataid', dataid);
    // }
   

    function downloadnow() {
        /*let res = axios({
          method: 'post',
          url: 'http://localhost:3001/request',
          data: {
            data: items,
            userid: userid
          } });*/
        }
    
    return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg no-scrollbar px-10 py-10">
    <table class="w-full text-md text-center text-gray-500 table-auto">
      <thead class="text-xs text-white uppercase bg-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Dataset ID
          </th>
          <th scope="col" class="px-6 py-3">
            Dataset Version
          </th>
          <th scope="col" class="px-6 py-3">
            Dataset Name
          </th>
          <th scope="col" class="px-6 py-3">
            Dataset Description
          </th>
          <th scope="col" class="px-6 py-3">
            Access Type
          </th>
          <th scope="col" class="px-6 py-3">
            Author ID
          </th>
          <th scope="col" class="px-6 py-3">
            Status
          </th>
          <th scope="col" class="px-6 py-3">
            Published Date
          </th>
          <th scope="col" class="px-6 py-3">
            Download
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map(ver =>

          <tr className="bg-white border-b hover:bg-gray-50">
              
            <td className="px-6 py-4 font-lg">
            <Link
              to="/review"
              state={{ 'DatasetID': ver["DatasetID"]}}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-200"
            >
              {ver["DatasetID"]}
            </Link>

            </td>
            <td className="px-6 py-4 font-lg">
              {ver["Version"]}
            </td>

            <td className="px-6 py-4 font-medium text-gray-900">
              {ver["Name"]}
            </td>

            <td className="px-6 py-4">
              <div className="overflow-hidden hover:overflow-auto max-h-40 no-scrollbar">
              {ver["Description"]}
              </div>
            </td>

            <td className="px-6 py-4">
              <div className="overflow-hidden hover:overflow-auto max-h-40 no-scrollbar">
              {ver["Public"] === "1"?"Public":"Private"}
              </div>
            </td>

            <td class="px-6 py-4">
              {ver["AuthorID"]}
            </td>

            <td class="px-6 py-4">
              {ver["Status"]}
            </td>

            <td className=''>
              {ver["Published"]}
            </td>
            <div className="inline-flex rounded-md shadow">
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
                  PrivateDataset(ver["Published"]);
                  if(ver["Public"] === "0" )
                  {
                    requestDatabaseAccess(ver["DatasetID"]);
                    //setdataidState();
                  }
                  else
                  {
                    downloadnow();
                  }
                }}>{(PrivateDataset(ver["Public"]) || haveaccess) ? 'Download Now' : 'Request'}</button>
              </div>
        
            
          </tr>
        )}
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
          <td>7</td>
          <td>8</td>
          <td>9</td>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
          <td>7</td>
          <td>8</td>
          <td>9</td>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
          <td>7</td>
          <td>8</td>
          <td>9</td>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
          <td>7</td>
          <td>8</td>
          <td>9</td>
        </tr>
      </tbody>
    </table>
  </div>
    )


}