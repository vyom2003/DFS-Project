import { useState, useRef, useEffect } from "react";
import { PlainText } from "../styled/Text";
import { humanReadableFileSize } from "../../packages/utils/humanReadableFilesize";
import { Button } from "../styled/Buttons";
import { useUploadFiles } from "./hooks/useUploadFiles";
import { ConfirmationModal } from "../confirmationModal/ConfirmationModal";
import { MODAL_VARIANTS } from "../confirmationModal/constants";

const ProgressBar = ({ progress }) => (
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
);

export const UploadMultipleFiles = ({
  setAllUploadedFileNames,
  setUploadedFileSize,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentState, setCurrentState] = useState("SELECT"); // "SELECT" | "UPLOADING" | "UPLOADED"
  const uploadFilesButtonRef = useRef({});
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const {
    progress,
    error: uploadError,
    uploadedFiles,
    currentlyUploadingFile,
    uploadFiles,
    reset,
  } = useUploadFiles();

  useEffect(() => {
    if (
      uploadedFiles.length === selectedFiles.length &&
      currentState !== "UPLOADED" &&
      uploadedFiles.length
    ) {
      setCurrentState("UPLOADED");
      setAllUploadedFileNames(uploadedFiles);
      setUploadedFileSize(selectedFiles[0].size);
    }
  }, [
    uploadedFiles,
    selectedFiles,
    currentState,
    setAllUploadedFileNames,
    setUploadedFileSize,
  ]);

  if (currentState === "UPLOADING" || currentState === "UPLOADED") {
    return uploadError ? (
      <>
        <Button.Red
          type="button"
          className="mt-2"
          onClick={() => setShowDeleteConfirmationModal(true)}
        >
          Reset Uploads
        </Button.Red>
        {showDeleteConfirmationModal && (
          <ConfirmationModal
            intent={MODAL_VARIANTS.DANGER}
            message={`This action will remove all uploaded files`}
            onCancel={() => {
              setShowDeleteConfirmationModal(false);
            }}
            onSuccess={() => {
              setSelectedFiles([]);
              setCurrentState("SELECT");
              reset();
              setShowDeleteConfirmationModal(false);
            }}
          />
        )}
      </>
    ) : (
      <div className="mb-3">
        {uploadedFiles.length < selectedFiles.length ? (
          <>
            <PlainText>
              Uploading File : {currentlyUploadingFile.name}
            </PlainText>
            <ProgressBar progress={progress} />
          </>
        ) : null}
        <PlainText className="text-green-800 font-semibold">
          {currentState === "UPLOADED" ? "All Files" : ""} Successfully uploaded
          :{" "}
        </PlainText>
        <table className="p-2 bg-slate-100 rounded-4">
          <thead>
            <tr className="border-bottom border-b-green-500">
              <th className="pl-2">#</th>
              <th>Filename</th>
              <th>File Size</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((uploadedFile, index) => (
              <tr
                className="border-bottom border-b-green-500"
                key={uploadedFile}
              >
                <td className="pl-2 pr-6">{index + 1}</td>
                <td className="pr-6 max-x-1/2 overflow-hidden">
                  {selectedFiles[index].name}
                </td>
                <td className="pr-6">
                  {humanReadableFileSize(selectedFiles[index].size)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button.Red
          type="button"
          className="mt-2"
          onClick={() => setShowDeleteConfirmationModal(true)}
        >
          Reset Uploads
        </Button.Red>
        {showDeleteConfirmationModal && (
          <ConfirmationModal
            intent={MODAL_VARIANTS.DANGER}
            message={`This action will remove all uploaded files`}
            onCancel={() => {
              setShowDeleteConfirmationModal(false);
            }}
            onSuccess={() => {
              setSelectedFiles([]);
              setCurrentState("SELECT");
              reset();
              setShowDeleteConfirmationModal(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      {selectedFiles.length ? (
        <>
          <PlainText>Uploaded Files : </PlainText>
          <table>
            <thead>
              <tr className="border-bottom border-sky-500">
                <th>#</th>
                <th>Filename</th>
                <th>File Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedFiles.map((uploadedFile, index) => (
                <tr
                  className="border-bottom border-sky-500"
                  key={`${uploadedFile.name}_${uploadedFile.size}`}
                >
                  <td className="pr-6">{index + 1}</td>
                  <td className="pr-6 max-x-1/2 overflow-hidden">
                    {uploadedFile.name}
                  </td>
                  <td className="pr-6">
                    {humanReadableFileSize(uploadedFile.size)}
                  </td>
                  <td>
                    <Button.Red
                      type="button"
                      onClick={() =>
                        setSelectedFiles((currentSelectedFiles) =>
                          currentSelectedFiles.filter(
                            (i) =>
                              i.name !== uploadedFile.name ||
                              i.size !== uploadedFile.size
                          )
                        )
                      }
                    >
                      Remove
                    </Button.Red>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      <label className="mr-2 mt-3 font-semibold" for="upload_multiple_files">
        {selectedFiles.length ? "Add More Files" : "Upload Files"}
      </label>

      <Button.Gray
        type="button"
        onClick={() => {
          if (uploadFilesButtonRef.current) {
            uploadFilesButtonRef.current.click();
          }
        }}
      >
        Select Files
      </Button.Gray>
      {selectedFiles.length ? (
        <Button.Blue
          className="mt-2 block"
          type="button"
          onClick={() => {
            uploadFiles(selectedFiles);
            setCurrentState("UPLOADING");
          }}
        >
          Upload Selected Files
        </Button.Blue>
      ) : null}

      <input
        className="hidden"
        id="upload_multiple_files"
        type="file"
        ref={uploadFilesButtonRef}
        multiple
        onChange={(e) => {
          setSelectedFiles((currentSelectedFiles) => [
            ...currentSelectedFiles,
            ...Array.from(e.target.files),
          ]);
        }}
      />
    </div>
  );
};
