import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import download from "js-file-download";
import creds from "../../creds";
import { CustomToast, UpdateToastData } from "../../containers";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { DomainDataTombstone } from "../../components/tombstones/DomainDataTombstone";

// const url= creds.backendUrl;
const url = creds.backendUrl;

export const DomainData = ({ domain, domainData }) => {
  const navigate = useNavigate();
  const [toastData, setToastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const countRef = useRef([toastData]);
  countRef.current = toastData;

  const isLoggedIn = !!localStorage.getItem("dfs-user");
  const [data, setData] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(url + "datasets", { params: { domain } })
      .then((data) => {
        // console.log("DATA", domain, data);
        console.log("data = ", data.data);
        setData(data.data);
      })
      .catch((err) => {
        // console.log("ERR", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [domain]);

  return (
    <div>
      {/* console.log(data); */}
      <div className="sticky top-10 z-50">
        <div className="fixed bottom-5 right-5">
          <CustomToast
            toastData={toastData}
            setToastData={setToastData}
            countRef={countRef}
          ></CustomToast>
        </div>
      </div>
      {loading ? (
        [1, 2, 3].map((k) => (
          <DomainDataTombstone key={k}/>
        ))
      ) : data.map((dataset, index) => (
        <div
          class="max rounded overflow-hidden shadow-2xl hover:shadow-3xl text-center mb-8"
          key={index}
        >
          <div class="px-6 py-4">
            <div class="font-bold text-3xl mb-4">{dataset.dataset_name}</div>
            <p class="text-gray-700 text-base mb-4 text-justify">
              {dataset.dataset_description && dataset.dataset_description.split('Π').map((data) => (<p className="mb-2">{data}</p>))}
            </p>
            {(dataset.source.includes('http') || dataset.source.includes('www')) ? <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-1"
              href={dataset.source}
            >
              Source
            </a> : null}
            <a
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full m-1"
              href={"/dataset-versions/" + dataset.dataset_id}
            >
              Details
            </a>
            <button
              class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full m-1 mt-2"
              onClick={() => {
                if (!isLoggedIn) {
                  UpdateToastData(
                    1,
                    toastData,
                    setToastData,
                    countRef,
                    "Sign In Required to Download",
                    "error",
                    5000
                  );
                }
                else {
                  window.location.href = url + "request-new-dataset?datasetid=" + dataset.dataset_id + "&token=" + (isLoggedIn ? JSON.parse(localStorage.getItem("dfs-user"))["token"] : null);
                }
              }}
            >
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
