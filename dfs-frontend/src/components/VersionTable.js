import { PaperClipIcon, DownloadIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import axios from "axios";

import creds from "../creds";
const url= creds.backendUrl;


export default function VersionTable(props) {
    const versions = props.versions
    const dataset = props.dataset
    let userid = localStorage.getItem('userid');
    return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg no-scrollbar">
    <table class="w-full text-md text-center text-gray-500 table-auto">
      <thead class="text-xs text-white uppercase bg-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Dataset Version
          </th>
          <th scope="col" class="px-6 py-3">
            Changes
          </th>
          <th scope="col" class="px-6 py-3">
            Files
          </th>
          <th scope="col" class="px-6 py-3">
            Published Date
          </th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {versions.map(ver =>
          <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 font-lg">
              {ver["Version"]}
            </td>

            <td className="px-6 py-4 font-medium text-gray-900">
              <div className="bg-white rounded-lg shadow overflow-hidden  hover:overflow-auto max-h-40 no-scrollbar">
                <ul className=" list-decimal list-inside divide-y divide-gray-100 text-sm">
                  {ver["Changes"].map(change => <li className="p-3 hover:bg-blue-600 hover:text-blue-200">{change}</li>)}
                </ul>
              </div>
            </td>

            <td className="px-6 py-4">
              <div className="overflow-hidden hover:overflow-auto max-h-40 no-scrollbar">
                <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {ver["files"].map(f => <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                <div className="w-40 flex-1 flex items-center">
                  <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-2 flex-1 whitespace-nowrap overflow-hidden text-ellipsis hover:whitespace-normal hover:overflow-scroll no-scrollbar">{f}</span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <DownloadIcon className="flex-shrink-0 h-5 w-5 text-gray-400 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer" aria-hidden="true" onClick={() => {
                    var params = new URLSearchParams();
                    params.set('AuthorID', userid);
                    // params.set('Status', 'PENDING');
                    axios.get(url + 'datasets?' + params.toString()).then(res => console.log(res));
                  }}/>
                </div>
              </li>)}
                </ul>
              </div>
            </td>

            <td className=''>
              {ver["Published"]}
            </td>

            <td class="px-6 py-4">
              <Link
                to="/upload"
                state={{ 'dataset': dataset, 'version': ver}}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-200"
              >
                Edit
              </Link>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
    )


}