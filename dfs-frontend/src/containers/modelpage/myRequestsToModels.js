import { useEffect, useState } from "react";
import * as React from "react";
import axios from "axios";
import creds from "../../creds";
import { GrFormRefresh } from "react-icons/gr";
import unsecuredCopyToClipboard from "../copytoclipboard/copyTextClick";
const url = creds.backendUrl;

export default function MyRequestsToModels({
  copiedTimeoutId,
  copiedIndex,
  showCopied,
  setCopiedIndex,
  setShowCopied,
  setCopiedTimeoutId,
}) {
  const [RequestData, setRequestData] = useState([]);
  const [requestRefreshState, setRequestRefreshState] = useState("loaded");

  const updateRequestToModels = () => {
    axios
      .get(
        url +
          "req-model-status?token=" +
          JSON.parse(localStorage.getItem("dfs-user"))["token"] +
          "&requester_id=" +
          JSON.parse(localStorage.getItem("dfs-user"))["user"]["user_email"],
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        setRequestData(res.data.data);
      });
  };

  const handleRefreshRequests = () => {
    setRequestRefreshState("loading");
    axios
      .get(
        url +
          "req-model-status?token=" +
          JSON.parse(localStorage.getItem("dfs-user"))["token"] +
          "&requester_id=" +
          JSON.parse(localStorage.getItem("dfs-user"))["user"]["user_email"],
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        setRequestData(res.data.data);
        setRequestRefreshState("loaded");
      });
  };

  useEffect(() => {
    const intervalID = setInterval(() => {
      updateRequestToModels();
    }, 30000);
    updateRequestToModels();
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
        <h1>My Requests</h1>
        <div style={{ justifySelf: "flex-end" }}>
          {requestRefreshState === "loaded" ? (
            <button
              onClick={handleRefreshRequests}
              className="btn btn-transparent mr-3 focus:border-transparent focus:ring-0"
            >
              <GrFormRefresh size={25} />
            </button>
          ) : (
            <button
              className="btn btn-transparent mr-3 focus:border-transparent focus:ring-0"
              style={{ textAlign: "center" }}
            >
              <svg
                aria-hidden="true"
                role="status"
                class="inline mr-3 w-4 h-4  animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          {RequestData.length > 0 ? (
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Requestee ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Model ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Comments
                    </th>
                    <th
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      style={{ padding: "10px" }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RequestData.map((req, index) => (
                    <tr index={"req" + index}>
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap flex">
                          {req.requestee_id}
                        </p>
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap flex">
                          <span title={req.model_id}>
                            {req.model_id.split("-")[0] + "-.."}
                          </span>{" "}
                          &nbsp;
                          <svg
                            className="w-5 h-5 cursor-pointer"
                            fill={
                              copiedIndex === "my_req_model_id_" + index &&
                              showCopied
                                ? "green"
                                : "currentColor"
                            }
                            x="0px"
                            y="0px"
                            width="20"
                            height="20"
                            viewBox={
                              copiedIndex === "my_req_model_id_" + index &&
                              showCopied
                                ? "0 0 30 30"
                                : "0 0 20 20"
                            }
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => {
                              unsecuredCopyToClipboard(req.model_id);
                              clearTimeout(copiedTimeoutId);
                              setShowCopied(true);
                              setCopiedIndex("my_req_model_id_" + index);
                              setCopiedTimeoutId(
                                setTimeout(() => {
                                  setShowCopied(false);
                                }, 3000)
                              );
                            }}
                          >
                            {copiedIndex === "my_req_model_id_" + index &&
                            showCopied ? (
                              <path d="M 11.078125 24.3125 L 2.847656 15.890625 L 6.128906 12.53125 L 11.078125 17.597656 L 23.519531 4.875 L 26.796875 8.230469 Z M 11.078125 24.3125 "></path>
                            ) : (
                              <>
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                              </>
                            )}
                          </svg>
                          {/* {req.model_id} */}
                        </p>
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap flex">
                          {req.comment}
                        </p>
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                        {req.request_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Your file access requests will appear here</p>
          )}
        </div>
      </div>
    </>
  );
}
