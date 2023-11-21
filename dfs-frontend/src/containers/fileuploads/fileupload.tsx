import axios from "axios";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { Heading } from "../../components/styled/Text";
import { useParams } from "react-router-dom";
import { url } from "../../creds";
import { isPartialVersionId, isVersionId } from "../../utils";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { LargeInputField } from "../../components/styled/Forms";
import { Button as StyledButton } from "../../components/styled/Buttons";
import {
  UploadAllFileForm,
  UploadFileForm,
  UploadAdditionalFilesForm,
} from "../../components/files/UploadFileForm";
import { UploadMultipleFiles } from '../../components/files/UploadMultipleFiles'
import { useLocation } from "react-router";

const axiosInstance = axios.create({ baseURL: url });

const piSeparatedInputRenderer = ({
  valueArray,
  updateValue,
  addValue,
  removeValue,
}: {
  valueArray: { comment: string; index: number; }[];
  updateValue : any;
  addValue: any;
  removeValue: any;
}) => (
  <>
    {valueArray.map((comment, index) => (
      <LargeInputField
        key={index}
        value={comment}
        onChange={(e: any) => updateValue({ index, newValue: e.target.value.replaceAll(';', '').replaceAll("'", "") })}
        className="mt-2"
      />
    ))}
    <StyledButton.Blue className="mt-2" onClick={addValue} type="button">
      Add Paragraph
    </StyledButton.Blue>
    {valueArray.length > 1 ? (
      <StyledButton.Red
        className="mt-2 ml-2"
        onClick={removeValue}
        type="button"
      >
        Delete Last Paragraph
      </StyledButton.Red>
    ) : null}
  </>
);

const usePiSeparatedInput = (initialValue : string): any => {
  const [valueArray, setValueArray] = useState(initialValue.trim().split("Π"));

  const addValue = useCallback(() => {
    setValueArray([...valueArray, ""]);
  }, [valueArray]);

  const removeValue = useCallback(() => {
    if (valueArray.length) {
      setValueArray((currArray) =>
        currArray.filter((_, i) => i < currArray.length - 1)
      );
    }
  }, [valueArray]);

  const updateValue = useCallback(({ index: editingIndex, newValue } : any): any => {
    setValueArray((valueArray) =>
      valueArray.map((element, index) =>
        index === editingIndex ? newValue : element
      )
    );
  }, []);

  const getValue = () => valueArray.map((e) => e.trim()).join("Π");

  return { addValue, removeValue, updateValue, getValue, valueArray };
};

const Uploadfiles = ({
  isFirstDataset,
  datasetId,
  dataset_name: _dataset_name,
}: {
  isFirstDataset?: boolean;
  datasetId?: string;
  dataset_name?: string;
}) => {
  const isDisabled = isFirstDataset && !datasetId;
  const { dataset_id: datasetIdFromParams, dataset_name = _dataset_name } =
    useParams();
  const dataset_id = isFirstDataset ? datasetId : datasetIdFromParams;

  const [filetype, setFileType] = useState("");
  const [filesize, setFilesize] = useState("");
  const [databaseId, setDatabaseId] = useState(dataset_id);
  const [databaseVersionId, setDatabaseVersionId] = useState("");
  const [uploadStatus, setUploadStatus] = useState(0);
  const [allUploadedFileNames, setAllUploadedFileNames] = useState([]);
  const [upfilename, setUpfilename] = useState("");
  const [upfilenameMD, setUpfilenameMD] = useState("");
  const [version_name, setVersionName] = useState("");
  const [reference, setReference] = useState("");
  const [created_date, setCreatedDate] = useState<string | number>("");
  const [display_created_date, setDisplayCreatedDate] = useState("");
  const [publication_names, setPublNames] = useState("");
  const [publication_links, setPublLinks] = useState("");
  const [Fpublic, setPublic] = useState("public");

  const [additionalFileList, setAdditionalFileList] = useState([]);

  const { getValue: getComment, ...commentInputProps } =
    usePiSeparatedInput("");

  const form_class =
    "w-2/3 align-end px-4 py-4 mx-4 my-4 border border-solid border-current rounded-lg bg-white shadow-2xl";

  const { addToast } = useContext(ToastContext);
  const sqlsubmit = (e : React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (isDisabled) {
      addToast({
        message: "Please fill upload dataset first",
        variant: TOAST_VARIANTS.WARNING,
      });
      return;
    }
    if (
      filetype &&
      filesize &&
      allUploadedFileNames.length &&
      upfilenameMD &&
      dataset_id &&
      databaseVersionId &&
      getComment() &&
      version_name &&
      reference &&
      created_date &&
      Fpublic
    ) {
      axiosInstance
        .post(
          "/sqlfile",
          {
            filetype,
            filesize,
            upfilename: allUploadedFileNames[0],
            upfilenameMD,
            databaseId: dataset_id,
            databaseVersionId,
            comments: getComment(),
            version_name,
            reference,
            created_date,
            publication_names,
            publication_links,
            public: Fpublic,
            additional: [...allUploadedFileNames].splice(1)
              .filter((i) => i !== "")
              .join("|||||"),
          },
          {
            headers: {
              Authorization:
                "Bearer " +
                JSON.parse(localStorage.getItem("dfs-user") ?? "{}")["token"],
            },
          }
        )
        .then((res) => {
          if (res.data.error) {
            addToast({
              message: "File is already uploaded",
              variant: TOAST_VARIANTS.WARNING,
            });
          } else {
            addToast({
              message: isFirstDataset ? "Dataset Details and Vesion Upload successful" : "File successfully uploaded",
              variant: TOAST_VARIANTS.SUCCESS,
            });
          }
        })
        .catch((err) => {
          addToast({
            message: "UPLOAD ERROR",
            variant: TOAST_VARIANTS.ERROR,
          });
        });
    } else {
      e.preventDefault();
      addToast({
        message: "Please fill all the form details",
        variant: TOAST_VARIANTS.WARNING,
      });
    }
  };

  if (isDisabled) {
    return (
      <div className={form_class}>
        <Heading size={2}>
          Upload a dataset to dataset version upload form
        </Heading>
      </div>
    );
  }
  return (
    <div className={form_class}>
      {dataset_name ? (
        <Heading size={3} className="mb-4">
          Upload Dataset Version to Dataset <b>{dataset_name}</b>
        </Heading>
      ) : null}
      <form onSubmit={sqlsubmit}>
        <>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example1">
              File Type:{" "}
            </label>
            <input
              value={filetype}
              className={
                filetype === "" ? "form-control" : "form-control bg-slate-50"
              }
              onChange={(e) => setFileType(e.target.value)}
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Database Id:{" "}
            </label>
            <input
              value={dataset_id}
              className={
                dataset_id === "" ? "form-control" : "form-control bg-slate-50"
              }
              disabled
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Database Version Id:{" "}
              <small>In format: (number-number-number)</small>
            </label>
            <input
              value={databaseVersionId}
              className={
                databaseVersionId === ""
                  ? "form-control"
                  : "form-control bg-slate-50"
              }
              onChange={(e) =>
                setDatabaseVersionId((currVal) =>
                  isPartialVersionId(e.target.value) ||
                    isVersionId(e.target.value)
                    ? e.target.value
                    : currVal
                )
              }
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Description:{" "}
            </label>
            {piSeparatedInputRenderer(commentInputProps)}
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Version_name:{" "}
            </label>
            <input
              value={version_name}
              className={
                version_name === ""
                  ? "form-control"
                  : "form-control bg-slate-50"
              }
              onChange={(e) => setVersionName(e.target.value)}
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Reference:{" "}
            </label>
            <input
              value={reference}
              className={
                reference === "" ? "form-control" : "form-control bg-slate-50"
              }
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Created_date:{" "}
            </label>
            <input
              type="date"
              value={display_created_date}
              className={
                display_created_date === ""
                  ? "form-control"
                  : "form-control bg-slate-50"
              }
              onChange={(e) => {
                const dateObj = new Date(e.target.value);
                setDisplayCreatedDate(e.target.value);
                setCreatedDate(dateObj.valueOf());
              }}
              placeholder="DD-MM-YYYY"
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Publication_names (csv):{" "}
            </label>
            <input
              value={publication_names}
              className={
                publication_names === ""
                  ? "form-control"
                  : "form-control bg-slate-50"
              }
              onChange={(e) => setPublNames(e.target.value)}
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Publication_links :{" "}
            </label>
            <input
              value={publication_links}
              className={
                publication_links === ""
                  ? "form-control"
                  : "form-control bg-slate-50"
              }
              onChange={(e) => setPublLinks(e.target.value)}
            />
          </div>
          <div className="form-outline mb-6">
            <label className="form-label text-base" htmlFor="form2Example2">
              Private{" "}
            </label>
            <input
              className="border border-solid border-slate-150 pl-1 pr-1 pb-2.5 pt-2.5 ml-2"
              checked={Fpublic === "private"}
              onChange={(e) => {
                if (Fpublic === "private") setPublic("public");
                else setPublic("private");
              }}
              type="checkbox"
            />
          </div>
        </>

        <hr className="mb-2" />
        <UploadMultipleFiles setAllUploadedFileNames={setAllUploadedFileNames} setUploadedFileSize={setFilesize} />

        <UploadFileForm
          uploadedFilename={upfilenameMD}
          setUploadedFilename={setUpfilenameMD}
          label={"README file"}
          setUploadedFilesize={null}
        />

        <UploadAdditionalFilesForm
        />
      </form>
    </div>
  );
}

export default Uploadfiles;
