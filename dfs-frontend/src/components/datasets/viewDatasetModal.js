import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { withAuth } from "../../withAuth";
import { url } from "../../creds";
import { Button } from "../styled/Buttons";
import { Link } from "react-router-dom";
import { PlainText, Heading } from "../styled/Text.jsx";
import MDEditor from "@uiw/react-md-editor";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { DatasetDetailsTable } from "./components/DatasetDetailsTable";
import { datasetDetailsValueMap } from "./utils";
import { datasetDetailsMap } from "./utils";
const isLoggedIn = !!localStorage.getItem("dfs-user");

const sanitizeAdditionalFileName = (fname) => {
  const arr = fname.split("_");
  arr.splice(-1);
  return arr.join("_");
};

const TncViewer = ({ target_id, setTncLoading }) => {
  const [md_data, setMDData] = useState("");
  useEffect(() => {
    setTncLoading(true);
    axios
      .get(url + "tnc?target_id=" + target_id)
      .then((res) => {
        if (res.data.error) {
          // UpdateToastData(1, toastData, setToastData, countRef, "unable to fetch recent tnc file", "error", 5000);
        } else {
          setMDData(res.data.data[0] ? res.data.data[0].md_data : "");
        }
        setTncLoading(false);
      })
      .catch((err) => {
        // UpdateToastData(1, toastData, setToastData, countRef, "SERVER ERROR", "error", 5000);
        setTncLoading(false);
      });
  }, [target_id, setTncLoading, setMDData]);
  // return md_data;
  return md_data.replaceAll(" ", "").length > 0 ? (
    <MDEditor.Markdown
      source={md_data}
      style={{ whiteSpace: "pre-wrap", padding: "1rem" }}
    />
  ) : (
    <PlainText>Tnc is not added yet for this dataset</PlainText>
  );
};
function ViewDatasetModal(props) {
  const [allowEditTnc, setAllowEditTnc] = useState(false);
  const [reqstatus, setReqStatus] = useState("unreqested");
  const [comment, setComment] = useState("");
  const [reload, setReload] = useState(0);
  const [acceptTnc, setAcceptTnc] = useState(
    props.user.user.user_email === props.targetElement.author_id
  );

  const [author, setAuthor] = useState(false);
  const [tncLoading, setTncLoading] = useState(false);

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    axios
      .get(
        url +
          "download-req-status?upfilename=" +
          props.targetElement?.upfilename +
          "&token=" +
          (isLoggedIn ? props.user.token : null)
      )

      .then((res) => {
        let currUser = props.user.user.user_email;
        if (currUser === props.targetElement.author_id) {
          setAllowEditTnc(true);
          setAcceptTnc(true);
          setReqStatus("accepted");
          setAuthor(true);
        } else if (res.data.length > 0) {
          // requested
          if (res.data[0]?.public) {
            // setAcceptTnc(true);
            setReqStatus("accepted");
            setAuthor(true);
          } else {
            setReqStatus(res.data[0].stat);
          }
        } else {
          setReqStatus("unreqested");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.targetElement, reload]);
  const download_url =
    url +
    "download?filename=" +
    props.targetElement?.upfilename +
    "&datasetid=" +
    props.targetElement?.database_id +
    "&token=" +
    (isLoggedIn ? props.user.token : null);

  const download_readme_url =
    url +
    "download?filename=" +
    props.targetElement?.upfilenameMD +
    "&datasetid=" +
    props.targetElement?.database_id +
    "&token=" +
    (isLoggedIn ? props.user.token : null);

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {/* <Modal.Header closeButton> */}
        <Modal.Title
          className="ml-3 mt-3 pt-1"
          id="contained-modal-title-vcenter"
        >
          <Modal.Title id="contained-modal-title-vcenter">
            <Heading size="3xl">
              Dataset : {props.targetElement?.version_name}
            </Heading>
          </Modal.Title>
        </Modal.Title>
        <Modal.Body>
          {props.showFileDetails ? (
            <>
              <DatasetDetailsTable
                targetElement={props.targetElement}
                showFileDetails={props.showFileDetails}
                allowEditTnc={author}
                reqstatus={reqstatus}
                acceptTnc={undefined}
                download_url={download_url}
                setAcceptTnc={setAcceptTnc}
                download_readme_url={download_readme_url}
              />
              {props.user.user.user_email === props.targetElement.author_id ? (
                <Link
                  to={"/dataset-version/" + props.targetElement?.upfilename}
                  state={{ fileData: props.targetElement }}
                >
                  <Button.Red className="float-right">Manage</Button.Red>
                </Link>
              ) : null}
            </>
          ) : (
            <>
              <div className="mt-2 pt-4">
                <>
                  <Heading size="2">Terms and Conditions to Download</Heading>
                  <div
                    className="container border border-1 border-slate-500"
                    data-color-mode="light"
                  >
                    <TncViewer
                      target_id={props.targetElement?.upfilename}
                      setTncLoading={setTncLoading}
                    />
                  </div>{" "}
                  {props.targetElement?.author_id ===
                  props.user.user.user_email ? (
                    <Link
                      to={`/tnc-edit/${props.targetElement?.upfilename}`}
                      className="text-blue-500"
                    >
                      TNC EDIT LINK
                    </Link>
                  ) : null}
                </>
                {acceptTnc ? (
                  <table className="w-full mt-2">
                    <tr>
                      <td className="px-3 py-1 break-words bg-table-shade border border-shade-400">
                        {datasetDetailsMap("upfilename")}
                      </td>
                      <td className="px-3 py-1 break-words bg-white border border-shade-400">
                        {datasetDetailsValueMap(
                          "upfilename",
                          props.targetElement.upfilename,
                          {
                            reqstatus,
                            acceptTnc,
                            download_url,
                            props,
                            setAcceptTnc,
                            download_readme_url,
                          }
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1 break-words bg-table-shade border border-shade-400">
                        {datasetDetailsMap("upfilenameMD")}
                      </td>
                      <td className="px-3 py-1 break-words bg-white border border-shade-400">
                        {datasetDetailsValueMap(
                          "upfilenameMD",
                          props.targetElement.upfilenameMD,
                          {
                            reqstatus,
                            acceptTnc,
                            download_url,
                            props,
                            setAcceptTnc,
                            download_readme_url,
                          }
                        )}
                      </td>
                    </tr>
                    {props.targetElement?.additional?.length === 0 ||
                    !props.targetElement?.additional
                      ? null
                      : props.targetElement.additional
                          .split("|||||")
                          .map((additionalFileName, index) => (
                            <tr key={additionalFileName}>
                              <td className="px-3 py-1 break-words bg-table-shade border border-shade-400">
                                Additional File #{index}
                              </td>
                              <td className="px-3 py-1 break-words bg-white border border-shade-400">
                                <a
                                  href={
                                    url +
                                    "download?filename=" +
                                    sanitizeAdditionalFileName(
                                      additionalFileName
                                    )
                                  }
                                  className="text-blue-500"
                                >
                                  {sanitizeAdditionalFileName(
                                    additionalFileName
                                  )}
                                </a>
                              </td>
                            </tr>
                          ))}
                    {props.targetElement?.additional?.length === 0 ? null : (
                      <tr>
                        <td />
                        <td>
                          <Button.Blue
                            className="mt-2 float-right"
                            onClick={(e) => {
                              e.preventDefault();
                              props.targetElement.additional
                                .split("|||||")
                                .forEach((additionalFileName, index) => {
                                  setTimeout(
                                    () =>
                                      window.open(
                                        url +
                                          "download?filename=" +
                                          sanitizeAdditionalFileName(
                                            additionalFileName
                                          )
                                      ),
                                    100 * index
                                  );
                                });
                            }}
                          >
                            Download all additional files
                          </Button.Blue>
                        </td>
                        {/* <td>Actions</td> */}
                      </tr>
                    )}
                  </table>
                ) : (
                  <>
                    <input
                      className="py-1"
                      type="checkbox"
                      onChange={() => setAcceptTnc((a) => !a)}
                    />
                    <label style={{ marginLeft: "5px" }}>
                      I accept the{" "}
                      <a
                        href={"/tnc/" + props.targetElement.database_id}
                        className="text-blue-500"
                      >
                        terms and conditions
                      </a>
                    </label>
                  </>
                )}
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          {reqstatus === "unreqested" && (
            <form
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(url + "download-req-create?token=" + props.user.token, {
                    comment: comment,
                    upfilename: props.targetElement?.upfilename,
                    upfilenameMD: props.targetElement?.upfilenameMD,
                    author: props.targetElement?.author_id,
                  })
                  .then((res) => {
                    if (res.error === "ER_DUP_ENTRY") {
                      addToast({
                        message: "ERROR: Already Requested",
                        variant: TOAST_VARIANTS.ERROR,
                      });
                    } else {
                      setReload(1 - reload);
                    }
                  })
                  .catch((err) => {});
              }}
            >
              <textarea
                style={{
                  border: "1px solid #eee",
                  padding: "5px 10px",
                  minWidth: "100%",
                  marginBottom: "20px",
                }}
                placeholder="Comments"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="btn btn-outline-primary"
                style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                type="submit"
              >
                Request Download Access
              </button>
            </form>
          )}
          {reqstatus === "requested" && (
            <p style={{ width: "100%", textAlign: "center", color: "gray" }}>
              Requested access, Awaiting permission
            </p>
          )}
          {reqstatus === "accepted" && (
            <p className="w-full text-center text-green-700">Granted access</p>
          )}
          {reqstatus === "rejected" && (
            <p style={{ width: "100%", textAlign: "center", color: "red" }}>
              Rejected access
            </p>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default withAuth(ViewDatasetModal);
