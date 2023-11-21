import axios from 'axios';
import React, { useState, useContext, useRef } from 'react';
import { Button as StyledButton } from '../styled/Buttons';
import { url } from '../../creds';
import { Heading, PlainText } from '../styled/Text';
import { ToastContext } from '../../App';
import { TOAST_VARIANTS } from '../../packages/toasts/constants';

const axiosInstance = axios.create({ baseURL: url });

const getDisplayFilename = (filename, isAdditional = false) => {
  const split = filename.split("_");
  const displayFilename = split.slice(1, split.length).join("_");
  if (isAdditional) {
    const split = displayFilename.split("_");
    return split.slice(0, split.length - 1).join("_");
  }
  return displayFilename;
};

const getTotalSize = (selectedFiles) => {
  return selectedFiles.reduce((totalSize, file) => totalSize + file.size, 0);
};

const getFormattedFilesize = (filesize) => {
  if (filesize < 1024) {
    return `${filesize} Bytes`;
  } else if (filesize < 1024 * 1024) {
    return `${Math.round((filesize / 1024) * 100) / 100} KB`;
  } else if (filesize < 1024 * 1024 * 1024) {
    return `${Math.round((filesize / (1024 * 1024)) * 100) / 100} MB`;
  } else if (filesize < 1024 * 1024 * 1024 * 1024) {
    return `${Math.round((filesize / (1024 * 1024 * 1024)) * 100) / 100} GB`;
  }
};

const arrayWithMutedElement = (array, index, value) => {
  if (array.length === index) return [...array, value];
  return array.map((originalValue, i) => (index === i ? value : originalValue));
};

export const UploadAllFileForm = ({
  uploadedFilename,
  setUploadedFilename,
  setUploadedFilesize,
  setAdditionalFileList,
  label,
}) => {
  const [progress, setProgress] = useState();
  const [error, setError] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [errorFileNames, setErrorFileNames] = useState([]);

  const [filesize, setFilesize] = useState();
  const [loadFlag, setLoad] = useState(true);
  const { addToast } = useContext(ToastContext);
  const filesUploadedRefCount = useRef(0);
  const onUpload = (e) => {
    setErrorFileNames([]);
    setUploadedFileNames([]);
    filesUploadedRefCount.current = 0;
    const fileName = selectedFiles[0].name;
    selectedFiles.map((file, idx) => {      
      let formData = new FormData();
      
      formData.append("file", file);

      axiosInstance
        .post("/upload_file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            setProgress(
              Math.round(100 * (data.loaded / data.total))
            );
          },
        })
        .then((res) => {
          filesUploadedRefCount.current++;
          setUploadedFilesize(res.data.filesize);
          if(getDisplayFilename(res.data.filename) === fileName)
            setUploadedFilename(res.data.filename);    
          else
            setAdditionalFileList(prevNames => [...prevNames, res.data.filename + "_" + res.data.filesize]);
          setUploadedFileNames(prevNames => [...prevNames, res.data.filename]);
          
        })
        .catch((error) => {
          setErrorFileNames(prevNames => [...prevNames, file.name]);
          const code = error?.response?.data?.code;
          setError(true);
          switch (code) {
            case "FILE_MISSING":
              addToast({
                message: "Please select a file to upload",
                variant: TOAST_VARIANTS.ERROR,
              })
              break;
            case "LIMIT_FILE_SIZE":
              addToast({
                message: "File size is too large. Please upload files below 1GB!",
                variant: TOAST_VARIANTS.ERROR,
              })
              break;
            case "INVALID_TYPE":
              addToast({
                message:
                  "This file type is not supported. Only .png, .jpg, and .jpeg files are allowed",
                variant: TOAST_VARIANTS.ERROR,
              })
              break;
            default:
              setError("Sorry, something went wrong");
              break;
          }
        })
      })
      setLoad(false);
  };

  return (
    <form>
      <hr />
      { (uploadedFilename.length === 0 || filesUploadedRefCount.current < selectedFiles.length) ? (
        <>
          <div className="mb-3">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="file_input"
            >
              Select {label}
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              multiple
              onChange={(e) => {
                setSelectedFiles(Array.from(e.target.files));
              }}
            />
          </div>
          <div className="mb-6">
            <StyledButton.Blue onClick={() => onUpload()} type="button">
              Upload All Files
            </StyledButton.Blue>
          </div>
        </>
      ) : null
      }

      {progress && filesUploadedRefCount.current < selectedFiles.length && (
        // progress bar for file upload
        <div className="mb-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {progress}%
                </span>
              </div>
            </div>
            <h6>{filesUploadedRefCount.current} / {selectedFiles.length} files uploaded</h6>
            <br/>

            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              >
              </div>
                
            </div>
            <div className="mb-6">
              {error &&
                <StyledButton.Green onClick={() => onUpload()} type="button">
                  Re-Upload All
                </StyledButton.Green>
              }
          </div>
          </div>
        </div>
      )}
      {errorFileNames.length > 0 && !loadFlag ? (
        <div className='max-h-60 overflow-scroll'>
        <p>
           Error in uploading {errorFileNames.length} Files. Please reselect the files and attempt upload again<br/>
           {errorFileNames.map((files, index) => (
            <p key = {index} className='bg-red-500 text-white mb-1 pl-2 mr-2 pr-2 text-sm'>
              {index + 1} - Error in Uploading : {files}
              <br/>
            </p>
            ))}
        </p>
        </div>
      ) : null}

      <PlainText>
        {errorFileNames.length ? '' : 'All' } <b>{selectedFiles.length}</b> File{filesUploadedRefCount.current > 1 ? 's' : ''} uploaded successfully.<br/>
        Total Size : <b>{getFormattedFilesize(getTotalSize(selectedFiles))}</b>
      </PlainText>

      {!loadFlag && filesUploadedRefCount.current ? (
        <ol className="list-decimal list-inside max-h-60 overflow-auto w-1/2 ml-1">
        {uploadedFileNames.map((fileName, index) => (
          <li key={fileName} className='mb-1 pl-2 mr-2 pr-2 text-sm'>
            {getDisplayFilename(fileName)}
            {index < uploadedFileNames.length - 1 ? <hr className="m-0"/> : null}
          </li>
        ))}
        </ol>

      ) : null}
    </form>
  )
}

export const UploadFileForm = ({
  uploadedFilename,
  setUploadedFilename,
  setUploadedFilesize,
  label,
}) => {
  const [progress, setProgress] = useState();
  const [error, setError] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filesize, setFilesize] = useState();

  const { addToast } = useContext(ToastContext);

  const onUpload = (e) => {
    let formData = new FormData();
    setUploadedFilename("");
    formData.append("file", selectedFiles[0]);
    axiosInstance
      .post("/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          setProgress(Math.round(100 * (data.loaded / data.total)));
        },
      })
      .then((res) => {
        setUploadedFilename(res.data.filename);
        setFilesize(res.data.filesize);
        if (setUploadedFilesize) {
          setUploadedFilesize(res.data.filesize);
        }
      })
      .catch((error) => {
        const code = error?.response?.data?.code;
        setError(true);
        switch (code) {
          case "FILE_MISSING":
            addToast({
              message: "Please select a file to upload",
              variant: TOAST_VARIANTS.ERROR,
            })
            break;
          case "LIMIT_FILE_SIZE":
            addToast({
              message: "File size is too large. Please upload files below 1GB!",
              variant: TOAST_VARIANTS.ERROR,
            })
            break;
          case "INVALID_TYPE":
            addToast({
              message:
                "This file type is not supported. Only .png, .jpg, and .jpeg files are allowed",
              variant: TOAST_VARIANTS.ERROR,
            })
            break;
          default:
            setError("Sorry, something went wrong");
            break;
        }
      });
  };

  return (
    <form>
      <hr />
      {uploadedFilename.length === 0 ? (
        <>
          <div className="mb-3">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="file_input"
            >
              Select {label}
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              onChange={(e) => {
                setSelectedFiles(e.target.files);
              }}
            />
          </div>
          <div className="mb-6">
            <StyledButton.Blue onClick={() => onUpload()} type="button">
              Upload {label}
            </StyledButton.Blue>
          </div>
        </>
      ) : null
      }
      {!error && progress && uploadedFilename.length == 0 && (
        // progress bar for file upload
        <div className="mb-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>
      )}
      {uploadedFilename.length > 0 && (
        <p>
          Uploded {label} successfully : <b>{getDisplayFilename(uploadedFilename)}</b>
          <br />
          Size: <b>{getFormattedFilesize(filesize)}</b>
        </p>
      )}
    </form>
  )
}

export const UploadAdditionalFilesForm = () => {
  const [additionalSelectedFiles, setAdditionalSelectedFiles] = useState([]);

  return (
    <>
      <div className="text-right">
        <button
          type="submit"
          className=" btn btn-primary mb-4 justify-center text-btn"
        >
          Submit
        </button>
      </div>
    </>
  )
}