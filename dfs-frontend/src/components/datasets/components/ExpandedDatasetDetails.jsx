import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { withAuth } from "../../../withAuth";
import { url } from "../../../creds";
import { Button } from "../../styled/Buttons";
import { Link } from "react-router-dom";
import { PlainText, Heading } from "../../styled/Text.jsx";
import MDEditor from "@uiw/react-md-editor";
import { ToastContext } from "../../../App";
import { TOAST_VARIANTS } from "../../../packages/toasts/constants";
import { DatasetDetailsTable } from "./DatasetDetailsTable";
import { datasetDetailsValueMap } from "../utils";
import { datasetDetailsMap } from "../utils";

const isLoggedIn = !!localStorage.getItem("dfs-user");

function ExpandedDatasetDetails(props) {
  const [allowEditTnc, setAllowEditTnc] = useState(false);
  const [reqstatus, setReqStatus] = useState("unreqested");
  const [comment, setComment] = useState("");
  const [reload, setReload] = useState(0);

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
          setReqStatus("accepted");
          setAuthor(true);
        } else if (res.data.length > 0) {
          // requested
          if (res.data[0]?.public) {
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
      <PlainText>{props.targetElement?.comments}</PlainText>
      {/* <DatasetDetailsTable
        targetElement={props.targetElement}
        showFileDetails={props.showFileDetails}
        allowEditTnc={allowEditTnc}
        reqstatus={reqstatus}
        acceptTnc={undefined}
        download_url={download_url}
        setAcceptTnc={true}
        download_readme_url={download_readme_url}
      /> */}
      {props.user.user.user_email === props.targetElement.author_id ? (
        <Link
          to={"/dataset-version/" + props.targetElement?.upfilename}
          state={{ fileData: props.targetElement }}
        >
          <Button.Red className="float-right m-0">Manage</Button.Red>
        </Link>
      ) : null}
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
    </>
  );
}

export default withAuth(ExpandedDatasetDetails);
