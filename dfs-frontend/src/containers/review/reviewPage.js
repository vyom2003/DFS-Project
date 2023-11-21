import { Link, useLocation } from 'react-router-dom';
import VersionTable from '../../components/VersionTable';
import Paginator from '../../components/Paginator';
// import { versions, datasets } from '../temp_data';
import { useEffect, useState } from 'react';
import axios from 'axios';

import creds from "../../creds";
const url= creds.backendUrl;




export default function ReviewPage() {

  const [dataset, setDataset] = useState({});
  const [versions, setVersions] = useState([]);
  const datasetId = useLocation().state.DatasetID;
  //Planning to use 
  // const [author, setAuthor] = useState('');
  console.log(datasetId);

  useEffect(() => {
    var params = new URLSearchParams();
    params.set('DatasetID', datasetId);
    axios.get(url+'datasets?' + params.toString()).then(res => {
      setDataset(res.data.dataset);
      setVersions(res.data.versions);
      //Planning to use this to get the dataset names
      //setAuthor(res.data.author);
      console.log(res.data.versions);
      console.log(res.data.dataset);
    });    
  }, [])

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg px-8">
      <div className="px-4 py-3 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Dataset Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the dataset.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dataset Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{dataset.Name}</dd>
          </div>
          <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dataset identifier</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{dataset.DatasetID}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Source URL</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{dataset.Source}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dataset Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {dataset.Description}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Terms and Conditions</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {dataset.TnC}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Dataset Availability</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {dataset.Public ? "Public" : "Private"}
            </dd>
          </div>
        </dl>

        
      </div>
      <VersionTable versions={versions} dataset={dataset} />
      <Paginator />

      <div className="flex justify-between py-8">

      <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
                <Link
                    to="/upload"
                    state={{ 'edit': true, 'dataset': dataset}}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                    Edit the Dataset
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/comments"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Comments
              </Link>
            </div>
          </div>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            {/* <div className="inline-flex rounded-md shadow">
              <Link
                to="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete Version
              </Link>
            </div> */}
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/upload"
                state={{ 'dataset': dataset }}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Upload new version
              </Link>
            </div>
          </div>
      </div>
    </div>
  )
}
