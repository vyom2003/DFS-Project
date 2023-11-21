import React from "react"
import { useEffect, useState } from "react";

import MyDataModels from "../dataModels/MyDataModels";
import ModelRequestsToMe from "./modelRequestToMe";
import MyRequestsToModels from "./myRequestsToModels";
import { Link, Navigate } from 'react-router-dom'

const divStyle = {
  // width: '90vw',
  background: 'white',
  padding: '3ch',
  borderRadius: '1ch'
}

export default function ModelPage() {
  let userid = localStorage.getItem("userid");
  const [copiedTimeoutId, setCopiedTimeoutId] = useState(-1);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [showCopied, setShowCopied] = useState(false);
  if(localStorage.getItem('dfs-user')){
    return (<>
      <div className="flex flex-col gap-y-7 my-7 w-full px-10">
        <div style={divStyle} className="w-full">
          <MyDataModels copiedTimeoutId={copiedTimeoutId} copiedIndex={copiedIndex} showCopied={showCopied} setCopiedIndex={setCopiedIndex} setShowCopied={setShowCopied} setCopiedTimeoutId={setCopiedTimeoutId} />
        </div>
        <div style={divStyle} className="w-full">
          <ModelRequestsToMe copiedTimeoutId={copiedTimeoutId} copiedIndex={copiedIndex} showCopied={showCopied} setCopiedIndex={setCopiedIndex} setShowCopied={setShowCopied} setCopiedTimeoutId={setCopiedTimeoutId} />
        </div>
        <div style={divStyle} className="w-full">
          <MyRequestsToModels copiedTimeoutId={copiedTimeoutId} copiedIndex={copiedIndex} showCopied={showCopied} setCopiedIndex={setCopiedIndex} setShowCopied={setShowCopied} setCopiedTimeoutId={setCopiedTimeoutId} />
        </div>
      </div>
    </>)  
  } 
  else return <Navigate to="/sign-in" replace={true} />;
}
