import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { url } from "../../creds";
import download from "js-file-download";
import { Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";

// components
import { Button } from "../styled/Buttons";
import { LargeInputField } from "../styled/Forms";

const RED_BUTTON_CLASS =
  "text-red-700 hover:text-white border-x border-y border-red-700 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm pr-2.5 pl-2.5 pt-1.5 pb-1.5 text-center mr-3 mb-3 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-700";

const DownloadButton = ({
  loading,
  model_id,
  reqstatus,
  setReqStatus,
  openEditModal,
  comment,
  setComment,
  groupRead,
  groupWrite,
  setShowModel,
  targetElement
}) => {
  const navigate = useNavigate();

  const { addToast } = useContext(ToastContext);

  console.log(reqstatus, "--", groupRead, "--", groupWrite);
  if (loading || reqstatus === "")
    return <span className="mb-3 mr-3">Loading...</span>;
  if (groupRead !== "" && groupWrite !== "") {
    if (groupWrite) {
      return (
        <>
          <Button.Blue onClick={() => navigate("/view-model/" + model_id)}>
            View Model
          </Button.Blue>
          <Button.Red onClick={() => openEditModal(targetElement)}>Edit</Button.Red>
        </>
      );
    } else if (groupRead) {
      return (
        <Button.Blue onClick={() => navigate("/view-model/" + model_id)}>
          View Model
        </Button.Blue>
      );
    }
  } else {
    switch (reqstatus) {
      case "unrequested":
        return (
          <form className="w-full text-right">
            <LargeInputField
              rows={2}
              className="w-full"
              placeholder="comments (optional)"
              onChange={(e) => {
                setComment(e.target.value);
              }}
            >
              {comment}
            </LargeInputField>
            <Button.Yellow
              onClick={(e) => {
                e.preventDefault();
                axios
                  .post(
                    url + `req-model`,
                    { model_id: model_id, comment: comment },
                    {
                      headers: {
                        Authorization:
                          "Bearer " +
                          JSON.parse(localStorage.getItem("dfs-user"))?.[
                            "token"
                          ],
                      },
                    }
                  )
                  .then((res) => {
                    console.log("check now", res);
                    if (!res.data?.error) {
                      setShowModel(false);
                      addToast({
                        message: "Data Model Requested",
                      });
                      // setReqStatus(data.request_status);
                    }
                  });
              }}
              className="mt-2"
            >
              Request
            </Button.Yellow>
          </form>
        );
      case "requested":
        return <Button.Gray disabled>Requested</Button.Gray>;
      case "read":
        return (
          <Button.Blue onClick={() => navigate("/view-model/" + model_id)}>
            View Model
          </Button.Blue>
        );
      case "write":
        return (
          <>
            <Button.Blue onClick={() => navigate("/view-model/" + model_id)}>
              View Model
            </Button.Blue>
            <Button.Red onClick={() => openEditModal(targetElement)}>Edit</Button.Red>
          </>
        );
      default:
        return <Button.Red disabled>Rejected</Button.Red>;
    }
  }
};

export default function ViewDatasetModal(props) {
  const [reqstatus, setReqStatus] = useState("");
  const [groupRead, setGroupRead] = useState("");
  const [groupWrite, setGroupWrite] = useState("");
  const [comment, setComment] = useState("");
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const model_id = props.targetElement?.model_id;
    setLoading(true);
    axios
      .get(url + `req-model-status?model_id=${model_id}`, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))?.["token"],
        },
      })
      .then((res) => {
        setLoading(false);
        console.log("TOGO", res);
        if (res.data?.data?.length) {
          const data = res.data.data[0];
          if (data?.group_read || data?.group_write) {
            setGroupRead(data.group_read);
            setGroupWrite(data.group_write);
          } else if (data.request_status === "accepted") {
            setReqStatus(data.request_for);
            setGroupRead("");
            setGroupWrite("");
          } else {
            setReqStatus(data.request_status);
            setGroupRead("");
            setGroupWrite("");
          }
        } else {
          setReqStatus("unrequested");
          setGroupRead("");
          setGroupWrite("");
        }
      });
  }, [props]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <h4>Details</h4>
        <Table className="mb-0 table-bordered table-striped w-screen table-fixed">
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Dataset Version Id{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.dataset_version_id}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Dataset Id{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.dataset_id}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Domain{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.domain}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Model Id{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.model_id}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Model Name{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.model_name}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Group Id{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.group_id}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Author Id{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.author_id}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Author Name{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.author_name}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Author Names{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.authors_names}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Author Ids{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.authors_ids}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Created Date{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.created_datetime}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Last Updated{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.last_updated}
            </Td>{" "}
          </tr>
          <tr>
            {" "}
            <Td className="px-3 py-1 break-words bg-table-shade text-fn-blue">
              Updates{" "}
            </Td>{" "}
            <Td className="px-3 py-1 break-words bg-white">
              {props.targetElement?.updates}
            </Td>{" "}
          </tr>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <DownloadButton
          model_id={props.targetElement?.model_id}
          loading={loading}
          reqstatus={reqstatus}
          setReqStatus={setReqStatus}
          comment={comment}
          setComment={setComment}
          groupRead={groupRead}
          groupWrite={groupWrite}
          setShowModel={props.setShowModel}
          openEditModal={props.openEditModal}
          targetElement={props.targetElement}
          {...props}
        />
      </Modal.Footer>
    </Modal>
  );
}
