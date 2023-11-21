import React, { useState, memo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import creds from "../creds";
import { useEffect } from "react";
import ExpandedTable from "./expandedTable";

import { AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai";
const url = creds.backendUrl;

function DatasetDetails(props) {
  const [md_data, setValue] = useState("");
  const [click, setClick] = useState(false);
  const [expand, setExpand] = useState("Expand");
  const id = props?.id;

  const myFunction = async () => {
    setClick(!click);

    if (click === true) setExpand("Expand");
    else setExpand("Shrink");
  };

  useEffect(() => {
    axios
      .get(url + "get-dataset-id?id=" + id)
      .then((res) => {
        if (res.data.error) {
          alert("unable to fetch recent dataset details");
        } else {
          setValue(res.data.data[0] ? res.data.data[0] : "");
        }
      })
      .catch((err) => {
        alert("SERVER ERROR");
      });
  }, [expand, setExpand]);

  return (
    <div>
      <div className="flex" data-color-mode="light">
        {!click && (
          <div className="flex flex-col w-full px-0">
            <button className="float-right min-w" onClick={myFunction}>
              <AiOutlineExpandAlt size="20" />
            </button>

            <p className="bg-slate-150 w-full text-center pt-2 px-2 shadow-xl text-fn-blue">
              <span className="text-2xl text-center align-center font-bold">
                {md_data.dataset_name}{" "}
              </span>
              <span className="text-lg ml-1">{md_data.domain}</span>
              <p className="mt-2.5 ml-2.5 mr-2.5">
                {md_data.dataset_description &&
                  md_data.dataset_description.split("Π")[0]}
              </p>
            </p>
          </div>
        )}

        {click && (
          <div className="mb-4 w-full">
            <button className="" onClick={myFunction}>
              {/* {'<-'} */}
              <AiOutlineShrink size="20" />
            </button>
            <ExpandedTable
              data={md_data.dataset_data}
              datasetId={md_data.dataset_id}
              authorId={md_data.author_id}
              domain={md_data.domain}
              status={md_data.dataset_status}
              format={md_data.dataset_format}
              source={md_data.source}
              description={md_data.dataset_description}
              reference={md_data.reference_list}
              name={md_data.dataset_name}
              visibility={md_data.visibility}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default memo(DatasetDetails);