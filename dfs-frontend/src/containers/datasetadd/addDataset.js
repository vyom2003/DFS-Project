import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { MultiPageFormHeader } from "../../components/MultiPageFormHeader";
import creds from "../../creds";
import Uploadfiles from "../fileuploads/fileupload";
import { Heading, PlainText } from "../../components/styled/Text";
import { Button } from "../../components/styled/Buttons";
const url = creds.backendUrl;

// const axiosInstance = axios.create({ baseURL: "http://10.4.25.20:3001/" });
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

//     "dataset_id": "2328710d-e0c6-4fa8-b28a-265b4b6fa7d1",
//     "author_id": "amey.kudari@students.iiit.ac.in",
//     "reference_list": "https://dl.acm.org/doi/abs/10.1145/2827872,https://dl.acm.org/doi/fullHtml/10.1145/3458723",
//     "dataset_name": "Thar Desert Rain",
//     "dataset_description": "Rainfall statistics recorded across multiple regions and large timeframes in the Thar desert",
//     "public": 1,
//     "source": "IAF",
//     "dataset_data": null,
//     "dataset_format": "csv",
//     "temporary": 1,
//     "dataset_status": "REJECTED",
//     "domain": "Wildlife"

const updateDescription = (
  index,
  data,
  setDatasetDescription,
  datasetDescription
) => {
  const arr_desc = [...datasetDescription];
  setDatasetDescription(arr_desc, (arr_desc[index] = data));
};

const form_class =
  "w-2/3 align-end px-4 py-4 mx-4 my-3 border border-solid border-current rounded-lg bg-white shadow-2xl";

export default function AddDataset() {
  // let user = JSON.parse(localStorage.getItem('dfs-user'));
  const [datasetId, setDatasetID] = useState(create_UUID());
  const [page, setPage] = useState('dataset');
  const authorId = JSON.parse(localStorage.getItem("dfs-user"))["user"][
    "user_email"
  ];
  const [referenceList, setReferenceList] = useState("");
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState([""]);
  const [source, setSource] = useState("");
  const [datasetFormat, setDatasetFormat] = useState("");
  const [searchq, setSearchq] = useState("");
  const [domainLst, setDomainLst] = useState([]);
  const [domain, setDomain] = useState(""); // set existing domain for now
  const [loading, setLoading] = useState(false);
  const [uploadedDatasetId, setUploadedDatasetId] = useState(undefined);

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    axios
      .get(url + "domains", {
        params: { searchq },
      })
      .then((res) => {
        console.log(res);
        setDomainLst(res.data.data);
      });
  }, [searchq]);

  const submitHandler = (e) => {
    e.preventDefault();
    const piSepDescArr = datasetDescription;
    piSepDescArr.map((s) => s.trim());
    piSepDescArr.filter(function (str) {
      return str !== "";
    });
    console.log(piSepDescArr);
    const piSepDescStr = piSepDescArr.join("Π");
    console.log(piSepDescStr);

    const payload = {
      datasetId,
      authorId,
      referenceList,
      datasetName,
      piSepDescStr,
      source,
      datasetFormat,
      domain,
    };
    let valid = true;
    // console.log("payload = ",payload);
    setLoading(true);
    Object.keys(payload).forEach((key) => {
      if (valid && payload[key] === "") {
        addToast({
          message: "Please fill out all values, including: " + key,
          variant: TOAST_VARIANTS.WARNING,
        });
        valid = false;
      }
    });
    if (valid) {
      axios
        .post(url + "add-dataset", payload, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        })
        .then((res) => {
          if (res.data.error) {
            addToast({
              message: res.data.message,
              variant: TOAST_VARIANTS.ERROR,
            });
            setLoading(false);
          } else {
            setUploadedDatasetId(datasetId);
            setPage('file');
            addToast({
              message: "Dataset Details added successfully",
              variant: TOAST_VARIANTS.SUCCESS,
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          addToast({
            message: "Server Error " + JSON.stringify(err),
            variant: TOAST_VARIANTS.ERROR,
          });
          setLoading(false);
        });
    }
    // if(valid)
  };

  return (
    <>
      <MultiPageFormHeader
        page={page}
        setPage={setPage}
        stepList={
        [
          {
            header: "Dataset Metadata",
            disabled: false,
            page: 'dataset',
          },
          {
            header: "Add Version",
            disabled: uploadedDatasetId ? false : true,
            page: 'file',
          },
        ]
      } />
      {page === 'dataset' ?
      <div className={form_class}>
        <form onSubmit={submitHandler}>
          <div className="form-outline mb-6">
            <label className="form-label text-base" for="form2Example2">
              Author Id:{" "}
            </label>
            <input
              disabled={uploadedDatasetId}
              value={authorId}
              className={
                authorId === "" ? "form-control" : "form-control bg-slate-50"
              }
              />
            </div>

          <div className="form-outline mb-6">
            <label className="form-label text-base" for="form2Example2">
              Name:{" "}
            </label>
            <input
              disabled={uploadedDatasetId}
              value={datasetName}
              className={
                datasetName === "" ? "form-control" : "form-control bg-slate-50"
              }
              onChange={(e) => setDatasetName(e.target.value)}
            />
          </div>

          <div className="form-outline mb-6">
            <label className="form-label text-base" for="form2Example2">
              Reference List:{" "}
            </label>
            <input
              disabled={uploadedDatasetId}
              value={referenceList}
              className={
                referenceList === ""
                  ? "form-control"
                  : "form-control bg-slate-50"
              }
              onChange={(e) => setReferenceList(e.target.value)}
            />
          </div>

          <div className="flex flex-col mb-6 w-full px-0">
            <label className="form-label text-base mb-0" for="form2Example2">
              Description:{" "}
            </label>
            {datasetDescription.map((data, index) => (
              <div className="form-outline mt-2">
                <textarea
                  disabled={uploadedDatasetId}
                  value={data}
                  className={
                    data === "" ? "form-control" : "form-control bg-slate-50"
                  }
                  onChange={(e) => {
                    updateDescription(
                      index,
                      e.target.value.replaceAll(';', '').replaceAll("'", ""),
                      setDatasetDescription,
                      datasetDescription
                    );
                  }}
                  rows="2"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
              </div>
            ))}

            <div>
              <button
                type="button"
                disabled={uploadedDatasetId}
                onClick={() =>
                  setDatasetDescription([...datasetDescription, ""])
                }
                class="focus:outline-none mt-2 text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
              >
                Add Paragraph
              </button>
            </div>
          </div>

          <div className="form-outline mb-6">
            <label className="form-label text-base" for="form2Example2">
              Source:{" "}
            </label>
            <input
              disabled={uploadedDatasetId}
              value={source}
              className={
                source === "" ? "form-control" : "form-control bg-slate-50"
              }
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="form-outline mb-6">
            <label className="form-label text-base" for="form2Example2">
              Dataset Format:{" "}
            </label>
            <input
              value={datasetFormat}
              disabled={uploadedDatasetId}
              className={
                datasetFormat === ""
                  ? "form-control"
                  : "form-control bg-slate-50"
              }
              onChange={(e) => setDatasetFormat(e.target.value)}
              placeholder="CSV/JSON/XML etc"
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" for="form2Example2">
              Domain:{" "}
            </label>
            <select
              value={domain}
              className={
                domain === "" ? "form-control" : "form-control bg-slate-50"
              }
              onChange={(e) => {
                console.log(e.target.value);
                setDomain(e.target.value);
              }}
              disabled={uploadedDatasetId}
            >
              <option value=""></option>
              {domainLst.map((domain, key) => (
                <option value={domain.domain}> {domain.domain}</option>
              ))}
            </select>
            <br /> <br />
          </div>

          { !uploadedDatasetId ? <div className="text-right" title={uploadedDatasetId ? 'Dataset Already Uploaded' : ''}>
            <button
              type="submit"
              className=" btn btn-primary mb-4 justify-center text-btn"
            >
              Register Dataset and proceed
            </button>
          </div> : <PlainText size={2} className="text-green-500">Dataset Details added successfully</PlainText> }
        </form>
      </div> :
        <Uploadfiles datasetId={uploadedDatasetId} isFirstDataset dataset_name={datasetName}/>
      }
    </>
  );
}
