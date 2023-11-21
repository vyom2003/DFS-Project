import { useEffect, useState, useContext } from "react";
import * as React from "react";
import axios from "axios";
import creds from "../../creds";
import PermissionSelectModal from "./modelAcceptPermissions";
import unsecuredCopyToClipboard from "../copytoclipboard/copyTextClick";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";

const url = creds.backendUrl;

export default function ModelRequestsToMe({
  copiedTimeoutId,
  copiedIndex,
  showCopied,
  setCopiedIndex,
  setShowCopied,
  setCopiedTimeoutId,
}) {
  const [RequestData, setRequestData] = useState([]);
  const [ref, setRef] = useState(0);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionModalData, setPermissionModalData] = useState({});

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    // change to headers, not a sercurity issue cuz of ssl, but needed
    axios
      .get(
        url +
          "req-model-status?token=" +
          JSON.parse(localStorage.getItem("dfs-user"))["token"] +
          "&requestee_id=" +
          JSON.parse(localStorage.getItem("dfs-user"))["user"]["user_email"],
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          addToast({
            message: res.data.message,
            variant: TOAST_VARIANTS.ERROR
          })
        } else {
          setRequestData(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref, addToast]);

  return (
    <>
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center justify-between">
          <p
            className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl"
            style={{ fontWeight: "500" }}
          >
            Requests to Me
          </p>
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
                      Requester
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Model requested
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Request Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Permission
                    </th>
                    <th
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      style={{ padding: "10px" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RequestData.map((req, index) => (
                    <tr index={"req" + index}>
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap flex">
                          {req.requester_id}
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
                              copiedIndex === "req_to_me_model_id_" + index &&
                              showCopied
                                ? "green"
                                : "currentColor"
                            }
                            x="0px"
                            y="0px"
                            width="20"
                            height="20"
                            viewBox={
                              copiedIndex === "req_to_me_model_id_" + index &&
                              showCopied
                                ? "0 0 30 30"
                                : "0 0 20 20"
                            }
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => {
                              unsecuredCopyToClipboard(req.model_id);
                              clearTimeout(copiedTimeoutId);
                              setShowCopied(true);
                              setCopiedIndex("req_to_me_model_id_" + index);
                              setCopiedTimeoutId(
                                setTimeout(() => {
                                  setShowCopied(false);
                                }, 3000)
                              );
                            }}
                          >
                            {copiedIndex === "req_to_me_model_id_" + index &&
                            showCopied ? (
                              <path d="M 11.078125 24.3125 L 2.847656 15.890625 L 6.128906 12.53125 L 11.078125 17.597656 L 23.519531 4.875 L 26.796875 8.230469 Z M 11.078125 24.3125 "></path>
                            ) : (
                              <>
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                              </>
                            )}
                          </svg>
                        </p>
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap flex">
                          {req.request_status}
                        </p>
                      </td>
                      <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap flex">
                          {req.request_status === "accepted"
                            ? req.request_for
                            : "-"}
                        </p>
                      </td>
                      <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                        {req.request_status === "requested" && (
                          <>
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                setPermissionModalData(req);
                                setShowPermissionModal(true);
                              }}
                            >
                              {" "}
                              ACCEPT{" "}
                            </button>{" "}
                            &nbsp;
                            <button
                              className="btn btn-outline-danger"
                              onClick={(e) => {
                                // console.log(req);
                                axios
                                  .post(
                                    url +
                                      "req-model-action?token=" +
                                      JSON.parse(
                                        localStorage.getItem("dfs-user")
                                      )["token"] +
                                      "&model_id=" +
                                      req.model_id,
                                    { ...req, action: "rejected" },
                                    {
                                      headers: {
                                        Authorization:
                                          "Bearer " +
                                          JSON.parse(
                                            localStorage.getItem("dfs-user")
                                          )["token"],
                                      },
                                    }
                                  )
                                  .then((res) => {
                                    console.log(res);
                                    if (res.error) {
                                      addToast({
                                        message: "400: Bad Request",
                                        variant: TOAST_VARIANTS.ERROR
                                      })
                                    } else {
                                      addToast({
                                        message: "Request Rejected"
                                      })
                                      setRef(1 - ref);
                                    }
                                  });
                              }}
                            >
                              {" "}
                              REJECT{" "}
                            </button>
                          </>
                        )}
                        {req.request_status === "accepted" && (
                          <>
                            <button
                              className="btn btn-outline-danger"
                              onClick={(e) => {
                                // console.log(req);
                                axios
                                  .post(
                                    url +
                                      "req-model-action?token=" +
                                      JSON.parse(
                                        localStorage.getItem("dfs-user")
                                      )["token"] +
                                      "&model_id=" +
                                      req.model_id,
                                    { ...req, action: "rejected" },
                                    {
                                      headers: {
                                        Authorization:
                                          "Bearer " +
                                          JSON.parse(
                                            localStorage.getItem("dfs-user")
                                          )["token"],
                                      },
                                    }
                                  )
                                  .then((res) => {
                                    console.log(res);
                                    if (res.error) {
                                      addToast({
                                        message: "400: Bad Request",
                                        variant: TOAST_VARIANTS.ERROR
                                      })
                                    } else {
                                      addToast({
                                        message: "Request Rejected",
                                      })
                                      setRef(1 - ref);
                                    }
                                  });
                              }}
                            >
                              {" "}
                              REJECT{" "}
                            </button>
                          </>
                        )}
                        {req.request_status === "rejected" && (
                          <>
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                setPermissionModalData(req);
                                setShowPermissionModal(true);
                              }}
                            >
                              {" "}
                              ACCEPT{" "}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>File Requests to you will appear here</p>
          )}
        </div>
        <PermissionSelectModal
          show={showPermissionModal}
          onHide={() => {
            setShowPermissionModal(false);
            setRef(1 - ref);
          }}
          targetElement={permissionModalData}
        />
      </div>
    </>
  );
}
