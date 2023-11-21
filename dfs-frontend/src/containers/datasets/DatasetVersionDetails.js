import React, { useState, memo } from "react";
import ExpandedVersionTable from "./ExpandedTable";

function DatasetVersionDetails(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div className="items-center w-full justify-center" data-color-mode="light">
        {!isExpanded && (
          <div className="items-center">
            
            <div className="column">

              <p className="flex flex-col bg-white text-center pt-2 text-fn-blue rounded-xl">
              <h4 className="text-black underline">Dateset Version Details</h4>
                <span className="text-2xl text-center align-center font-bold">
                  {props.data.version_name}{" "}
                </span>
                <span className="text-lg ml-1">
                  {props.data.upfilename}
                </span>
                <button
                  className="gradient__text text-lg border-none mb-3"
                  onClick={()=>setIsExpanded(!isExpanded)}
                >
                   Expand{'->'}
                </button>
              </p>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mb-4 bg-white py-4 px-4">
          <h2 className="text-center">Dataset Version Details</h2>
            <button
              className="items-center align-center text-center mt-2 gradient__text text-lg border-none mb-2"
              onClick={()=>setIsExpanded(!isExpanded)}
            >
              Shrink{'->'}
            </button>
            <ExpandedVersionTable
              fileType={props.data.filetype}
              upfilename={props.data.upfilename}
              upfilenameMD={props.data.upfilenameMD}
              databaseId={props.data.database_id}
              databaseVersionId={props.data.databaseVersion_id}
              comments={props.data.comments}
              versionName = {props.data.version_name}
              reference={props.data.reference}
              createdDate={props.data.created_date}
              lastEdit={props.data.last_edit}
              publicationName={props.data.publication_names}
              publicationLinks={props.data.publication_links}
              verification={props.data.verification}
              authorId={props.data.author_id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default memo(DatasetVersionDetails);
