import axios from "axios";
import { useState, useCallback } from "react";
import { url } from "../../../creds";
const axiosInstance = axios.create({ baseURL: url });

const KB = 1024;
const GB = 1024 * KB;
const TB = 1024 * GB;

export const useUploadFiles = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentlyUploadingFile, setCurrentlyUploadingFile] = useState("");

  const uploadFiles = useCallback(
    (files) => {
      const totalFilesize = files.reduce((acc, i) => i.size + acc, 0);
      if (totalFilesize > TB * 100) {
        setError("LIMIT_FILE_SIZE");
        return;
      }
      files.forEach((currentFile) => {
        if (!error) {
          setCurrentlyUploadingFile(currentFile);
          let formData = new FormData();

          formData.append("file", currentFile);

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
              if (res.data && res.data.filename) {
                setUploadedFiles((currentUploadedFiles) =>
                  currentUploadedFiles.length === 0
                    ? [res.data.filename]
                    : [
                        ...currentUploadedFiles,
                        res.data.filename + "_" + res.data.filesize,
                      ]
                );
              } else {
                setError("ERROR");
              }
            })
            .catch((_error) => {
              setError(_error?.response?.data?.code ?? "ERROR");
            });
        }
      });
    },
    [error]
  );

  return {
    progress,
    error,
    uploadedFiles,
    currentlyUploadingFile,
    uploadFiles,
    reset: () => {
      setUploadedFiles([]);
      setError(false);
    },
  };
};
