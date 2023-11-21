import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ViewDatasetModal from "./viewDatasetModal";
import creds from "../../creds";
import DatasetDetails from "../DatasetDetails";
import DatasetVersionsTable from "./components/DatasetVersionsTable";
import DatasetVersionListItem from "./components/DatasetVersionListItem";

const url = creds.backendUrl;

const divStyle = {
  width: "90vw",
  background: "white",
  padding: "1ch",
  borderRadius: "1ch",
  marginTop: "2rem",
  marginBottom: "2rem",
};

const DatasetVersionHeader = ({ datasetname_startswith, setSearchQ }) => (
  <div className="flex flex-wrap items-center justify-between pb-6">
    <div className="items-center justify-between">
      <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl md-0">
        <span style={{ fontWeight: 500 }}>Dataset Versions</span>{" "}
      </p>
    </div>
    <div class="flex bg-gray-50 items-center p-2 rounded-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        class="bg-gray-50 outline-none ml-1 block "
        type="text"
        value={datasetname_startswith}
        onChange={(e) => setSearchQ(e.target.value)}
        placeholder="search..."
      />
    </div>
  </div>
);

export default function AllVersions() {
  const [modalShow, setmodalShow] = React.useState(false);
  const [targetElement, setTarget] = useState({});
  const [versionData, setVersionData] = useState([]);
  const [tot, setTot] = useState(0);
  const [page, setPage] = useState(0);
  const [datasetname_startswith, setSearchQ] = useState("");
  const [sort, setSort] = useState("dataset_name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [expandedView, setExpandedView] = useState('');


  const user = JSON.parse(localStorage.getItem("dfs-user"));
  const isLoggedIn = !!(user ? user.user : false);

  const [databaseDetails, setDatabaseDetails] = useState({});
  const sortFunction = (key) => {
    if (sort === key) {
      if (sortOrder === "ASC") setSortOrder("DESC");
      else setSortOrder("ASC");
    } else setSort(key);
  };

  const { dataset_id } = useParams(); // eaaa6f65-4755-4dfe-87ff-6d51641aafaf
  // const dataset_id = 'eaaa6f65-4755-4dfe-87ff-6d51641aafaf';

  useEffect(() => {
    let params
    if (isLoggedIn) {
      params = {
        database_id: dataset_id,
        login: isLoggedIn,
        UserId: JSON.parse(localStorage.getItem("dfs-user")).user.user_email
      }
    }
    else {
      params = {
        database_id: dataset_id,
        login: isLoggedIn,
        UserId: null
      }
    }
    axios
      .get(url + "dataset-versions-datasetid", { params })
      .then((res) => {
        setVersionData(res.data.data.slice(page, page + 500));
        setTot(parseInt(res.data.data.length));

        axios
          .get(url + "get-dataset-id?id=" + dataset_id)
          .then((res) => {
            if (res.data.data.length > 0) {
              setDatabaseDetails(res.data.data[0]);
            }
          })
          .catch((err) => {
            console.log("ERROR WITH DATABASE", err);
          });
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
  }, [page, datasetname_startswith, sort, sortOrder]);

  const [view, setView] = useState('Table');
  return (
    <div>
      <div style={divStyle}>
        <div class="bg-white p-8 rounded-md w-full">
          <DatasetDetails id={dataset_id} />
        </div>
      </div>

      <div style={divStyle}>
        {" "}
        <div className="p-8">
          <DatasetVersionHeader
            datasetname_startswith={datasetname_startswith}
            setSearchQ={setSearchQ}
          />
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" onChange={e => setView(e.target.checked ? 'List' : 'Table')} />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{view}</span>
          </label>

          {view === 'Table' ? <div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <DatasetVersionsTable
                  versionData={versionData}
                  sort={sort}
                  sortOrder={sortOrder}
                  sortFunction={sortFunction}
                  setmodalShow={setmodalShow}
                  setShowFileDetails={setShowFileDetails}
                  setTarget={setTarget}
                  expandedView={expandedView}
                  isLoggedIn={isLoggedIn}
                />
                <div className="px-3 py-3 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                  <span className="text-xs xs:text-sm text-gray-900">
                    Showing {page + 1} to {Math.min(tot, page + 5)} of {tot} Entries
                  </span>
                  <div className="inline-flex mt-2 xs:mt-0">
                    <button
                      className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l disabled:opacity-50"
                      onClick={() => setPage(Math.max(0, page - 5))}
                      disabled={page === 0}
                    >
                      Prev
                    </button>
                    &nbsp; &nbsp;
                    <button
                      className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r disabled:opacity-50"
                      onClick={() => {
                        if (page + 5 !== tot) setPage(Math.min(tot, page + 5));
                      }}
                      disabled={page + 5 >= tot}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> : <>
            {versionData.map((data, index) => (
              <DatasetVersionListItem data={data} user={user}/>
            ))}
          </>}

            {isLoggedIn ? <ViewDatasetModal
              show={modalShow}
              onHide={() => setmodalShow(false)}
              targetElement={targetElement}
              showFileDetails={showFileDetails}
            /> : null}
        </div>
      </div>
    </div>
  );
}