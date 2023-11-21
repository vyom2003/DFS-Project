import {useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from 'react'
import { PaperClipIcon, XIcon, PlusIcon  } from '@heroicons/react/solid'
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

import creds from "../../creds";
const url= creds.backendUrl;



export default function UploadPage() {

  // Functional elements
  const [updateState, setUpdateState] = useState(0);
  const [metaEdit, setMetaEdit] = useState(false);
  const state = useLocation().state;
  let userid = localStorage.getItem('userid');
  // Metadata
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [desc, setDesc] = useState('');
  const [tnc, setTnc] = useState('');
  const [isPublic, setPublic] = useState(true);
  
  // Version related
  const [ver, setVer] = useState('1.0.0');
  const [changes, setChanges] = useState(['Initial Version']);
  const [currChange, setCurrChange] = useState('');
  
  // File related
  const [files, setFiles] = useState([]);
  const [filenames, setFilenames] = useState([]);
  //let userid = localStorage.getItem('userid');
  const navigate = useNavigate();

  useEffect(() => {

    if (state === null)
      setUpdateState(0)
    else
        if(state.version)
        {
          setUpdateState(3)
          console.log("Edit Version")
        }
        else
          if (state.edit)
          {
            setUpdateState(2)
            console.log("Edit Meta Data")
          }
          else
          {
            setUpdateState(1)
            console.log("Upload New version")
          }
  });

  useEffect(() => {
    if (updateState) {
      setName(state.dataset.Name);
      setSource(state.dataset.Source);
      setDesc(state.dataset.Description);
      setTnc(state.dataset.TnC);
      setPublic(state.dataset.Public);
    }

    switch (updateState) {
      case 1:
        setChanges([]);
        break;
      case 2:
        setMetaEdit(true);
        break;
      case 3:
        setVer(state.version.Version);
        setChanges(JSON.parse(state.version.Changes));
        break;
      default:
        break;
    } 
  }, [updateState]);
  
  const upload = () => {
    if (updateState === 0) {
      // Upload New dataset
      console.log("Uploading")
      var body = {
        'Name': name,
        'Description': desc.replace("'", ""),
        'AuthorID': userid,
        'Public': isPublic ? '1' : '0',
        'Tnc': tnc.replace("'", ""),
        'Source': source,
        'filenames': filenames,
        'userid': userid
      };
      console.log(body);

      const url = 'http://localhost:3001/datasets/upload';
      axios.post(url, body)
      .then(res => console.log(res));
      if (files.length > 0)
      navigate("/uploader", { state: { files: files } });
    }
    else if (updateState === 1) {
      // Upload New version
      // var id = '38'
      var id = state.dataset.DatasetID
      console.log("Uploading New Version");
      var body = {
        'Version': ver,
        'Changes': JSON.stringify(changes),
        'filenames': filenames
      };
      console.log("TEst")
      const url = 'http://localhost:3001/datasets/upload/' + id.toString();
      axios.post(url, body)
      .then(res => console.log(res));
      console.log(body);
      if (files.length > 0)
      navigate("/uploader", { state: { files: files } });
      else
      navigate("/")
    }
    else if (updateState === 2) {
      // Edit Meta Data
      console.log("Editing meta data");
      var DatasetID = state.dataset.DatasetID

      var body = {
        'Name': name,
        'Description': desc.replace("'", ""),
        'Public': isPublic ? '1' : '0',
        'Tnc': tnc
      };
      
      console.log(body);
      const url = 'http://localhost:3001/datasets/edit/' + DatasetID.toString();
      axios.post(url, body)
      .then(res => console.log(res));
      navigate("/review", { state: { 'DatasetID': DatasetID } });
    }
    else {
      // Edit Version
      console.log("Editiing version");
      var DatasetID = state.dataset.DatasetID

      var Version = ver

      var body = {
        'Changes': JSON.stringify(changes),
        'filenames': filenames
      }

      var params = new URLSearchParams();
      params.set('DatasetID', DatasetID);
      params.set('Version', Version)

      console.log(body)
      console.log(params)
      const url = 'http://localhost:3001/datasets/version?'+params.toString();
      console.log(url)
      axios.post(url, body)
      .then(res => console.log(res));
      if (files.length > 0)
      navigate("/uploader", { state: { files: files } });
      else
      navigate("/home")
    }
    console.log("Uploaded!!!")
    navigate("/home")
  }

  const addFile = (file) => {
    let newFilenames = [...file].map((f) => f.name).filter((f) => !(filenames.includes(f)));
    
    setFiles([...files, ...[...file].filter((f) => newFilenames.includes(f.name))]);
    setFilenames([...filenames, ...newFilenames]);
  }

  const removeFile = (file) => {
    setFiles(files.slice().filter((f) => f.name !== file));
    setFilenames(filenames.slice().filter((f) => f !== file));
  }

  const removeChange = (change) => {
    setChanges(changes.slice().filter((c) => c !== change));
  }

  const handleVersionChange = (v, ind) => {
    var currV = ver.split('.');
    if (v === '') v = 0;
    currV[ind] = parseInt(v);
    setVer(currV.join('.'));
    console.log(currV.join('.'));
  }

  const title = {
    0: "Upload a New Dataset",
    1: "Upload a New Version",
    2: "Edit Meta Data of the Dataset",
    3: "Edit the Dataset Version"
  }
  const titleExplain = { // Needs to be updated
    0: "Please input the details about the dataset.",
    1: "Please add the details about the new version.",
    2: "Please make relevant changes to the dataset metadata.",
    3: "Please make relevant changes to the dataset version."
  }

  return (
      <>
        <div className="py-16 px-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
  
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{title[updateState]}</h3>
                <p className="mt-1 text-sm text-gray-600">             
                  {titleExplain[updateState]}
                </p>
              </div>
            </div>

            <div className="mt-5 md:mt-0 md:col-span-2">
              <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-3 bg-white space-y-6 sm:p-6">
                    
                    <div className="grid grid-cols-3 gap-6">
                    
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name for the Dataset
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={updateState === 1 || updateState === 3}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Source URL
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            http://
                          </span>
                          <input
                            type="text"
                            name="website"
                            id="website"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="www.example.com"
                            disabled={updateState === 1 || updateState === 3}
                          />
                        </div>
                      </div>

                      {metaEdit || 
                      <div className="col-span-3 sm:col-span-3 lg:col-span-2">
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                          Version
                        </label>
                        <div className='flex inline justify-around'>
                          <input
                            type="text"
                            name="version"
                            id="version1"
                            value={ver.split('.')[0]}
                            onChange={(e) => handleVersionChange(e.target.value, 0)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-10 shadow-sm sm:text-sm border-gray-300 rounded-md"
                            disabled={updateState === 3 || updateState === 0}
                          />
                          <input
                            type="text"
                            name="version"
                            id="version2"
                            disabled={updateState === 3 || updateState === 0}
                            value={ver.split('.')[1]}
                            onChange={(e) => handleVersionChange(e.target.value, 1)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-10 shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            name="version"
                            id="version3"
                            disabled={updateState === 3 || updateState === 0}
                            value={ver.split('.')[2]}
                            onChange={(e) => handleVersionChange(e.target.value, 2)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-10 shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className='flex inline justify-around font-small text-xs text-gray-500'>
                          <span>Major</span>
                          <span>Minor</span>
                          <span>Patch</span>
                        </div>
                      </div>
                      }

                      {updateState !== 0 && updateState !== 2 && 
                      <>
                        <div className="col-span-3 sm:col-span-3 lg:col-span-1">
                          <label htmlFor="changes" className="block text-sm font-medium text-gray-700">
                            Changes
                          </label>
                          <div 
                          className='flex inline justify-between center'
                          style={{"align-items": "center"}}
                          >
                          <input
                            type="text"
                            name="changes"
                            id="changes"
                            value={currChange}
                            className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                            onChange={(e) => setCurrChange(e.target.value)}
                          />
                          <PlusIcon className="flex-shrink-0 h-5 w-5 text-gray-400 hover:text-indigo-500 hover:cursor-pointer" aria-hidden="true" onClick={() => {if (currChange !== '') setChanges([...changes, currChange]); setCurrChange('')}} />

                          </div>
                        </div>
                        <div className="col-span-3 sm:col-span-3 lg:col-span-2">
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200 overflow-auto max-h-40">
                            {changes.length >= 1 && changes.map((change) => {
                              return (
                              <li key={change} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                  <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                  <span className="ml-2 flex-1 w-0 whitespace-nowrap overflow-hidden text-ellipsis hover:whitespace-normal">{change}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                  <XIcon className="flex-shrink-0 h-5 w-5 text-gray-400 hover:text-indigo-500 hover:cursor-pointer" aria-hidden="true" onClick={() => removeChange(change)} />
                              </div>
                              </li>
                              )
                            })}
                            {changes.length < 1 && 
                            <li className="pl-3 pr-4 py-3 flex items-center justify-center text-sm">
                              <div className="w-0 flex-1 flex items-center">
                                  <span className="ml-2 flex-1 w-0 text-gray-400 text-center">No changes entered!</span>
                              </div>
                              </li>}
                        </ul>
                        </dd>
                        </div>
                        </>
                      }

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label htmlFor="privacy" className="block text-sm font-medium text-gray-700">
                          Privacy
                        </label>
                        <div class="flex justify-around">
                          <div class="form-check ">
                            <input 
                            class="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                            type="radio" 
                            id="inlineRadio1" 
                            value="Public"
                            disabled={updateState === 1 || updateState === 3}
                            onClick={() => setPublic(true)}
                            checked={isPublic}/>
                            <label class="form-check-label inline-block text-gray-800" for="inlineRadio10">Public</label>
                          </div>
                          <div class="form-check form-check-inline">
                            <input 
                            class="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                            type="radio" 
                            id="inlineRadio2" 
                            disabled={updateState === 1 || updateState === 3}
                            value="Private"
                            onClick={() => setPublic(false)}
                            checked={!isPublic}/>
                            <label class="form-check-label inline-block text-gray-800" for="inlineRadio20">Private</label>
                          </div>
                        </div>
                      </div>

                    </div>
  
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3 lg:col-span-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description of the Dataset
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Enter a brief description of the datset you wish to upload."
                            disabled={updateState === 1 || updateState === 3}
                            onChange={(e) => setDesc(e.target.value)}
                            value={desc}
                          />
                        </div>
                      </div>
                    

                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label htmlFor="tnc" className="block text-sm font-medium text-gray-700">
                          Terms and Conditions
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="tnc"
                            name="tnc"
                            rows={5}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Enter the terms and conditions for the usage of the dataset."
                            disabled={updateState === 1 || updateState === 3}
                            onChange={(e) => setTnc(e.target.value)}
                            value={tnc}
                            />
                        </div>
                      </div>
                    </div>
                    {metaEdit || <>
                    
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dataset files</label>
                          <FileUploader classes="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md" 
                          multiple={true} 
                          handleChange={(f) => addFile(f)} 
                          name="file"
                          children={
                            <div className="space-y-1 text-center"> 
                            
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Upload a file</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => addFile(e.target.files[0])} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">ZIP, TAR upto 100GBs</p>

                            </div>
                          }
                          />
                      </div>

                      <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">Selected Files</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200 overflow-auto max-h-40">
                              {files.length > 0 && files.map((file) => {
                                return (
                                <li key={file.names} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                  <div className="w-0 flex-1 flex items-center">
                                      <PaperClipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                      <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                      <XIcon className="flex-shrink-0 h-5 w-5 text-gray-400 hover:text-indigo-500 hover:cursor-pointer" aria-hidden="true" onClick={() => removeFile(file.name)}/>
                                  </div>
                                </li>
                                )
                              })}
                              {files.length < 1 && 
                                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                  <div className="w-0 flex-1 flex items-center">
                                      <span className="ml-2 flex-1 w-0 text-gray-400 text-center">No Files selected!</span>
                                  </div>
                                </li>
                                  }
                          </ul>
                          </dd>
                      </div>
                    </>}
                    </div>

                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      onClick={() => upload()}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-3">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        </div>
      </>
    )
};