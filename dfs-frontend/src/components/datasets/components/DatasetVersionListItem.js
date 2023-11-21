import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineDownload, AiFillCaretDown, AiFillCaretRight } from "react-icons/ai";
import moment from "moment";
import { url } from "../../../creds";
import { ToastContext } from "../../../App";
import { TOAST_VARIANTS } from "../../../packages/toasts/constants";
import { InputField } from "../../styled/Forms";
import { humanReadableFileSize } from "../../../packages/utils/humanReadableFilesize";

const sanitizeAdditionalFileName = fname => {
  const arr = fname.split('_');
  const ext = arr.splice(-1);
  return isNaN(ext) ? fname : arr.join('_');
};

const getFileName = (filename, isAdditional) => {
  let arr = filename.split('_');
  arr.shift();
  if (isAdditional) arr.pop();
  return arr.join('_');
}

const FileInfoRow = ({ filename, filetype, filesize, downloadUrl, isSelectAll, handleSelectFile, isLoggedIn, isAdditional }) => {
  return (
    <tr key={filename}>
      <td className="bg-slate-200 px-2 flex items-center gap-2"><InputField id={filename} type="checkbox" disabled={isSelectAll} onChange={handleSelectFile} />{getFileName(filename, isAdditional)}</td>
      <td className="bg-slate-200 px-2">{filetype}</td>
      <td className="bg-slate-200 px-2">{filesize ? humanReadableFileSize(filesize) : "-"}</td>
      <td className="bg-slate-200 px-2">
        {isLoggedIn ?
          <Link to={downloadUrl} target="_blank" rel="noreferrer">
            <AiOutlineDownload />
          </Link>
          :
          <AiOutlineDownload />
        }
      </td>
    </tr>
  )
}

const DatasetVersionDetailsTable = ({ data, user }) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const isLoggedIn = user ? true : false;

  const { addToast } = useContext(ToastContext);

  const token = user ? user.token : "";

  const downloadUrl =
    url +
    "download?filename=" +
    data.upfilename +
    "&datasetid=" +
    data.database_id
    + "&token=" + token;

  const downloadReadmeUrl =
    url +
    "download?filename=" +
    data.upfilenameMD +
    "&datasetid=" +
    data.database_id +
    "&token=" + token;

  const additionalFiles = data.additional === '' ? [] : data.additional.split('|||||');
  
  const handleSelectFile = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      setSelectedFiles((prev) => [...prev, id]);
    } else {
      setSelectedFiles((prev) => prev.filter((file) => file !== id));
    }
  };

  const handleDownloadSelectedFiles = () => {
    if (!isLoggedIn) {
      addToast({
        message: "Please login to download files",
        variant: TOAST_VARIANTS.ERROR,
      });
      return;
    }

    if (!isSelectAll && selectedFiles.length === 0) {
      addToast({
        message: "Please select at least one file to download",
        variant: TOAST_VARIANTS.ERROR,
      });
      return;
    }

    let previouslyDownloadedFileCount = 1;

    if (isSelectAll || selectedFiles.includes(data.upfilename)) {
      setTimeout(() => {
        window.open(downloadUrl, "_blank");
      }, previouslyDownloadedFileCount * 100);
      previouslyDownloadedFileCount++;
    }

    if (isSelectAll || selectedFiles.includes(data.upfilenameMD)) {
      setTimeout(() => {
        window.open(downloadReadmeUrl, "_blank");
      }, previouslyDownloadedFileCount * 100);
      previouslyDownloadedFileCount++;
    }

    if (isSelectAll) {
      additionalFiles.forEach((addFile, index) => {
        setTimeout(() => {
          window.open(url + "download?filename=" + sanitizeAdditionalFileName(addFile), "_blank");
        }, previouslyDownloadedFileCount * 100);
        previouslyDownloadedFileCount++;
      });
    } else {
      selectedFiles.filter((file) => file !== data.upfilename && file !== data.upfilenameMD).forEach((addFile, index) => {
        setTimeout(() => {
          window.open(url + "download?filename=" + sanitizeAdditionalFileName(addFile), "_blank");
        }, previouslyDownloadedFileCount * 100);
        previouslyDownloadedFileCount++;
      }
      );
    }
  }
  return (
    <tr> <td colspan="8">
      <table className="p-0 bg-slate-100 border-separate border-spacing-2 border border-slate-500 w-full">
        <tr>
          <td className="bg-slate-300 px-2">Created Date</td>
          <td className="bg-slate-200 px-2">{data.databaseVersion_id}</td>
          <td className="bg-slate-300 px-2">Last Modified</td>
          <td className="bg-slate-200 px-2">{moment(Number(data.created_date)).format("DD/MM/YYYY (on hh:mm:ss A)")}</td>
        </tr>
        <tr>
          <td className="bg-slate-300 px-2">Source</td>
          <td className="bg-slate-200 px-2">{data.reference}</td>
        </tr>
        <tr>
          <td className="bg-slate-300 px-2" colSpan="4">Publications</td>
        </tr>
        <tr>
          <td className="bg-slate-300 px-2">Publication Name</td>
          <td className="bg-slate-200 px-2" colSpan={3}>{data.publication_names}</td>
        </tr>
        <tr>
          <td className="bg-slate-300 px-2">Publication URL</td>
          <td className="bg-slate-200 px-2" colSpan={3}>{data.publication_links}</td>
        </tr>
        <tr>
          <td className="bg-slate-300 px-2" colSpan="4">Files</td>
        </tr>
        <tr>
          <td colSpan={4}>
            <table className="p-0 bg-slate-100 border-separate border-spacing-2 border border-slate-500 w-full">
              <tr>
                <td className="bg-slate-200 px-2 flex items-center gap-2"><input id="select-all" type="checkbox" onChange={(e) => setIsSelectAll(e.target.checked)} />Filename</td>
                <td className="bg-slate-200 px-2">File Type</td>
                <td className="bg-slate-200 px-2">File Size</td>
                <td className="bg-slate-200 px-2">
                  <button onClick={handleDownloadSelectedFiles} title={isSelectAll ? "Download all files" : "Download selected files"}>
                    <AiOutlineDownload />
                  </button>
                </td>
              </tr>
              <FileInfoRow
                filename={data.upfilename}
                filetype={data.filetype}
                filesize={data.filesize}
                downloadUrl={downloadUrl}
                isSelectAll={isSelectAll}
                handleSelectFile={handleSelectFile}
                isLoggedIn={isLoggedIn}
              />
              <FileInfoRow
                filename={data.upfilenameMD}
                filetype={data.filetype}
                downloadUrl={downloadReadmeUrl}
                isSelectAll={isSelectAll}
                handleSelectFile={handleSelectFile}
                isLoggedIn={isLoggedIn}
              />
              {additionalFiles.map((addFile, index) =>
                <FileInfoRow
                  filename={addFile}
                  filetype={data.filetype}
                  filesize={addFile.split('_').at(-1)}
                  downloadUrl={url + "download?filename=" + sanitizeAdditionalFileName(addFile)}
                  isSelectAll={isSelectAll}
                  isLoggedIn={isLoggedIn}
                  isAdditional
                  handleSelectFile={handleSelectFile}
                />
              )}
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  )
}

function DatasetVersionListItem({ data, user }) {
  const [expandedId, setExpandedId] = useState();
  return (
    <table className="mt-3 p-1 bg-slate-400 border-separate border-spacing-2 border border-slate-500 w-full" key={data.upfilename}>
      <tr className="bg-slate-300">
        <td className="whitespace-nowrap px-2">Version-Id</td>
        <td className="px-2">V{data.databaseVersion_id}</td>
        <td className="whitespace-nowrap px-2">Version Name</td>
        <td className="whitespace-nowrap px-2">{data.version_name}</td>
        <td>Created On</td>
        <td>{moment(Number(data.created_date)).format("DD/MM/YYYY (on hh:mm:ss A)")}</td>
        <td className="whitespace-nowrap px-2 bg-slate-400"><button onClick={() => setExpandedId(currentId => currentId === data.upfilename ? '' : data.upfilename)} className="border-0">
          {expandedId === data.upfilename ? <AiFillCaretDown size={30} /> : <AiFillCaretRight size={30} />}
        </button></td>
      </tr>
      <tr className="bg-slate-300">
        <td className="whitespace-nowrap px-2">Description</td>
        <td colspan="7" className="px-2">{expandedId === data.upfilename ? data.comments : `${data.comments.slice(0, 200)}...`}</td>
      </tr>
      {expandedId === data.upfilename ? <DatasetVersionDetailsTable data={data} user={user} /> : null}
    </table>
  )
}

export default DatasetVersionListItem;

