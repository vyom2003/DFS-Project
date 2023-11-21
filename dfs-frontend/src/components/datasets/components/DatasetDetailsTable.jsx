import React from "react";
import { Link } from "react-router-dom";
import { datasetDetailsValueMap, datasetDetailsMap } from "../utils";
const DatasetDetailsTable = ({
  targetElement,
  showFileDetails,
  allowEditTnc,
  reqstatus,
  acceptTnc,
  download_url,
  setAcceptTnc,
  download_readme_url,
}) => {

  return (
    <table className="mb-2 border-collapse border border-shade-400 w-full">
      <tbody>
        {Object.keys(targetElement ?? {})
          .filter((key) => key !== "upfilename" && key !== "upfilenameMD" && key !== "additional")
          .map((key) => (
            <tr key={key}>
              <td className="px-3 py-1 break-words bg-table-shade border border-shade-400">
                {datasetDetailsMap(key)}
              </td>
              <td className="px-3 py-1 break-words bg-white border border-shade-400">
                {datasetDetailsValueMap(key, targetElement[key], {
                  reqstatus,
                  acceptTnc,
                  download_url,
                  setAcceptTnc,
                  download_readme_url,
                })}
              </td>
            </tr>
          ))}
        {allowEditTnc ? (
          <tr>
            <td className="px-3 py-1 break-words bg-table-shade border border-shade-400">
              Edit TNC Link:{" "}
            </td>
            <td className="px-3 py-1 break-words bg-white border border-shade-400">
              <Link
                to={`/tnc-edit/${targetElement?.upfilename}`}
                className="text-blue-500"
              >
                TNC EDIT LINK
              </Link>
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
};

export { DatasetDetailsTable }
