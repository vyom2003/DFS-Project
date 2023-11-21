import React from "react";
import { useState } from "react";
import MyDatasets from "../../components/homepage/myDatasets";
import MyModels from "../../components/homepage/myModels";
import MyRequests from "../../components/homepage/myRequests";
import MyPermissionRequests from "../../components/homepage/myPermissionRequests";
import { withAuth } from "../../withAuth";

function HomePage() {
  const [copiedTimeoutId, setCopiedTimeoutId] = useState(-1);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [showCopied, setShowCopied] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-y-7 my-7 w-full px-10">
        <div className="w-full bg-white rounded-xl p-6">
          <MyDatasets
            copiedTimeoutId={copiedTimeoutId}
            copiedIndex={copiedIndex}
            showCopied={showCopied}
            setCopiedIndex={setCopiedIndex}
            setShowCopied={setShowCopied}
            setCopiedTimeoutId={setCopiedTimeoutId}
          />
        </div>
        <div className="w-full bg-white rounded-xl p-6">
          <MyModels
            copiedTimeoutId={copiedTimeoutId}
            copiedIndex={copiedIndex}
            showCopied={showCopied}
            setCopiedIndex={setCopiedIndex}
            setShowCopied={setShowCopied}
            setCopiedTimeoutId={setCopiedTimeoutId}
          />
        </div>
        <div className="w-full bg-white rounded-xl p-6">
          <MyRequests />
        </div>
        <div className="w-full bg-white rounded-xl p-6">
          <MyPermissionRequests />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomePage);
