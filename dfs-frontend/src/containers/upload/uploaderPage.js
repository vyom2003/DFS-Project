import {useState, useEffect} from "react";
import axios from "axios";
import { useStopwatch } from 'react-timer-hook';
import { useLocation, useNavigate } from "react-router-dom";
import creds from "../../creds";

const url= creds.backendUrl;
const chunkSize = 100 * 1024;



export default function UploaderPage() {

  // const [dropzoneActive, setDropzoneActive] = useState(false);
  // const [files, setFiles] = useState([]);
  const files = useLocation().state.files;
  console.log(useLocation());
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [times, setTimes] = useState([]);
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  const navigate = useNavigate();
  // function handleDrop(e) {
  //   e.preventDefault();
  //   setFiles([...files, ...e.dataTransfer.files]);
  // }

  function readAndUploadCurrentChunk() {
    const reader = new FileReader();
    const file = files[currentFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndex * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = e => uploadChunk(e);
    reader.readAsDataURL(blob);
  }

  function uploadChunk(readerEvent) {
    const file = files[currentFileIndex];
    const data = readerEvent.target.result;
    console.log(data);
    const params = new URLSearchParams();
    params.set('name', file.name);
    params.set('size', file.size);
    params.set('currentChunkIndex', currentChunkIndex);
    params.set('totalChunks', Math.ceil(file.size / chunkSize));
    console.log(file.size, uploadedSize);
    const headers = {'Content-Type': 'application/octet-stream'};
    const url = 'http://localhost:3001/files/uploadfile?'+params.toString();
    console.log('time', seconds);
    axios.post(url, data, {headers})
      .then(response => {
        const file = files[currentFileIndex];
        const filesize = files[currentFileIndex].size;
        const chunks = Math.ceil(filesize / chunkSize) - 1;
        const isLastChunk = currentChunkIndex === chunks;
        if (isLastChunk) {
          file.finalFilename = response.data.finalFilename;
          setLastUploadedFileIndex(currentFileIndex);
          setCurrentChunkIndex(null);
          pause();
          const timeTaken = seconds+minutes*60+hours*60*60+days*24*60*60
          setTimes([...times, timeTaken])
          reset();
          setUploadedSize(0);

        } else {
          setCurrentChunkIndex(currentChunkIndex + 1);
        }
        setUploadedSize(uploadedSize + chunkSize);
      });
  }

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1;
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
    setCurrentFileIndex(nextFileIndex);
  }, [lastUploadedFileIndex]);

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        );
      }
    }
    else
    navigate("/");
  }, [files.length]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
      start();
    }
  }, [currentFileIndex]);

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);

  return (
    <div>
      {/* <div
        onDragOver={e => {setDropzoneActive(true); e.preventDefault();}}
        onDragLeave={e => {setDropzoneActive(false); e.preventDefault();}}
        onDrop={e => handleDrop(e)}
        className={"bg-black dropzone" + (dropzoneActive ? " active" : "")}>
        Drop your files here
      </div> */}
      <div className="files">
        {files.map((file,fileIndex) => {
          let progress = 0;
          if (file.finalFilename) {
            progress = 100;
          } else {
            const uploading = fileIndex === currentFileIndex;
            const chunks = Math.ceil(file.size / chunkSize);
            if (uploading) {
              progress = Math.round(currentChunkIndex / chunks * 100);
            } else {
              progress = 0;
            }
          }
          return (
            // <a className="file" target="_blank"
            //    href={'http://localhost:3001/uploads/'+file.finalFilename}>
            //   <div className="name">{file.name}</div>
            //   <div className={"progress " + (progress === 100 ? 'done' : '')}
            //        style={{width:progress+'%'}}>{progress}%</div>
            // </a>
            <div class="w-full bg-gray-400  px-6 pt-5 pb-6">
                {file.name}: 
            <div class="w-full bg-gray-200 h-5 mb-6 rounded-full">
                <div class="bg-blue-600 h-5 mb-6 text-xs font-medium text-black text-center p-0.5 leading-none rounded-l-full" style={{width:progress+'%'}}> {progress}%</div>
            </div>
                Elapsed Time: {progress === 100 ? times[fileIndex] :seconds+minutes*60+hours*60*60+days*24*60*60}s {progress < 100 && "Speed: " + (uploadedSize/(1000000*seconds+minutes*60+hours*60*60+days*24*60*60)).toString() + " MB/s"}
            </div>
          );
        })}
      </div>
    </div>
  );
}