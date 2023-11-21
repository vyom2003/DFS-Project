import { useEffect, useState } from "react";
import axios from "axios";
import { BiSort, BiSortDown, BiSortUp } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi"
import creds from "../../creds";
import { withAuth } from "../../withAuth";
const url = creds.backendUrl;


export default function AllDatasets() {
  const [loading, setLoading] = useState(false);
  const [datasetData, setDatasetData] = useState([]);
  const [tot, setTot] = useState(0);
  const [page, setPage] = useState(0);
  const [datasetname_startswith, setSearchQ] = useState('');
  const [sort, setSort] = useState('dataset_name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const sortFunction = key => {
    if (sort === key) {
      if (sortOrder === 'ASC') setSortOrder('DESC');
      else setSortOrder('ASC');
    } else setSort(key);
  }
  useEffect(() => {
    let params = datasetname_startswith.length ? { datasetname_startswith } : { sort };
    params.sort_by = sort;
    params.order = sortOrder;
    // if(datasetname_startswith.length) params.datasetname_startswith = datasetname_startswith;
    axios.get(url + 'datasets', { params }).then(res => {
      setDatasetData(res.data.slice(page, page + 5));
      setTot(parseInt(res.data.length));
    }).catch(err => {
      console.log("ERROR", err);
    })
  }, [page, datasetname_startswith, sort, sortOrder]);

  return (<>
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center justify-between">
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">All Visible Datasets</p>
      </div>
      <div class="flex bg-gray-50 items-center p-2 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd" />
        </svg>
        <input class="bg-gray-50 outline-none ml-1 block " type="text" value={datasetname_startswith} onChange={e => setSearchQ(e.target.value)} placeholder="search..." />
      </div>

    </div>
    <div>
      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick={() => sortFunction('dataset_id')}>
                  Dataset id {sort === 'dataset_id' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right" />}
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick={() => sortFunction('dataset_name')}>
                  dataset_name {sort === 'dataset_name' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right" />}
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick={() => sortFunction('public')}>
                  Visiblity {sort === 'public' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right" />}
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick={() => sortFunction('source')}>
                  source {sort === 'source' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right" />}
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick={() => sortFunction('dataset_status')}>
                  Status {sort === 'dataset_status' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right" />}
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  onClick={() => sortFunction('dataset_description')}>
                  Description {sort === 'dataset_description' ? (sortOrder === 'ASC' ? <BiSortUp className="float-right" /> : <BiSortDown className="float-right" />) : <BiSort className="float-right" />}
                </th>
                <th
                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {datasetData.map((data, index) => (<tr>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap flex">
                    <span title={data.dataset_id}>{data.dataset_id.split('-')[0] + '-..'}</span> &nbsp;
                    <svg className="w-5 h-5 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                    </svg>
                  </p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{data.dataset_name}</p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {data.public ? <span className="text-green-900">Public</span> : <span className="text-red-900">Private</span>}
                  </p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {data.source}
                  </p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  {data.dataset_status === 'APPROVED' ? (
                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                      <span className="relative">Active</span>
                    </span>) : (
                    data.dataset_status === 'PENDING' ? (
                      <span className="relative inline-block px-3 py-1 font-semibold text-yellow-900 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-yellow-200 opacity-50 rounded-full"></span>
                        <span className="relative">Pending</span>
                      </span>
                    ) : (
                      <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                        <span className="relative">Rejected</span>
                      </span>)
                  )}
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap text-ellipsis" title={data.dataset_description}>
                    {data.dataset_description.slice(0, 20)}...
                  </p>
                </td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                  <button className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded">
                    Edit
                  </button>
                  <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ml-1 mr-2">
                    View
                  </button>
                  {/* <button className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded ml-1 p-4" onClick={()=>this.props.history.push(`/dataset-versions?dataset_id=` + data.dataset_id)}>
                  <FiExternalLink/>
                  </button> */}
                  <a href={"/dataset-versions/" + data.dataset_id} className="float-right">
                    <FiExternalLink />
                  </a>
                  {/* // </button> */}
                </td>
              </tr>))}
            </tbody>
          </table>
          <div
            className="px-5 py-3 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
            <span className="text-xs xs:text-sm text-gray-900">
              Showing {page + 1} to {page + 5} of {tot} Entries
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
              <button
                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l"
                onClick={() => setPage(Math.max(0, page - 5))}>
                Prev
              </button>
              &nbsp; &nbsp;
              <button
                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r"
                onClick={() => { if (page + 5 !== tot) setPage(Math.min(tot, page + 5)); }}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
};


// setDatasetData([{
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
