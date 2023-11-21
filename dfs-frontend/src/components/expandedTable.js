import React, { useState, useContext, useEffect } from "react";
import { Button } from "./styled/Buttons";
import Modal from "react-bootstrap/Modal";
import { url } from "../creds";
import axios from "axios";
import { ToastContext } from "../App";
import { TOAST_VARIANTS } from "../packages/toasts/constants";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const user = localStorage.getItem("dfs-user")
  ? JSON.parse(localStorage.getItem("dfs-user"))
  : {};

const VERSION_DETAIL_MAP = {
  datasetId: "Dataset Id",
  authorId: "Author Id",
  database_id: "Id",
  databaseVersion_id: "Version",
  name: "Name",
  created_date: "Created",
  last_edit: "Last edited",
  publication_names: "Publication Names",
  publication_links: "Publication Links",
  verification: "Verification Status",
  author_id: "Author Id",
  public: "access",
  data: "Data",
  temporary: "Type",
};

const versionDetailsMap = (value) =>
  VERSION_DETAIL_MAP[value] ?? capitalizeFirstLetter(value);

const versionDetailsValueMap = (key, value, params = {}) => {
  switch (key) {
    case "data":
      return "Uploaded";
    case "temporary":
      return value ? "Temporary dataset" : "Listed dataset";
    case "description":
      return (
        value && value.split("Π").map((data) => <p className="mb-2">{data}</p>)
      );
    default:
      return value;
  }
};

export default function ExpandedTable(props) {
  const VISIBILITY = Object.freeze({
    LISTED: "Listed",
    UNLISTED: "Unlisted",
  });

  const [modalOpen, setModalOpen] = useState(0);
  const [currentVisiblity, setCurrentVisiblity] = useState(props.visibility === 1 ? VISIBILITY.LISTED : VISIBILITY.UNLISTED);
  const [selectedVisiblity, setSelectedVisiblity] = useState(VISIBILITY.LISTED);

  const { addToast } = useContext(ToastContext);

  const handleSave = (event, datasetId) => {
    event.stopPropagation();
    if (currentVisiblity !== selectedVisiblity) {
      axios
        .post(url + "update-dataset-visibility", {
          selectedVisiblity:selectedVisiblity,
          params:{
            datasetId:datasetId,
          },
          headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('dfs-user'))['token']
          }
        })
        .then((res) => {
          setCurrentVisiblity(res.currentVisiblity);
          addToast({
            variant: TOAST_VARIANTS.SUCCESS,
            message: `Successfully Updated visibility to ${res.currentVisiblity}`,
          });
        })
        .catch((err) => {
          addToast({
            variant: TOAST_VARIANTS.ERROR,
            message: "Error in updating visibility",
          });
        });
    }
    else
    {
      addToast({
        variant: TOAST_VARIANTS.ERROR,
        message: "No changes made",
      });
    }
    setModalOpen(0);
  };
  const handleClose = (event) => {
    if(event){
      event.stopPropagation();
    }
    setModalOpen(0);
  };
  const handleShow = (event) => {
    if(event){
      event.stopPropagation();
    }
    setModalOpen(1);
  };
  return (
    <div>
      <table className="w-full border-collapse border border-slate-400">
        <tbody>
          {Object.keys(props).map((key) => (
            <tr key={key} className="border border-slate-700">
              <td className="px-3 py-1 break-words bg-table-shade">
                {versionDetailsMap(key)}
              </td>
              <td className="px-3 py-1 break-words bg-white">
                {key !== "visibility" ? (
                  versionDetailsValueMap(key, props[key])
                ) : (
                  <div className="flex items-end">
                    <p className="flex items-end">{currentVisiblity}</p>
                    {user.user && user.user.user_email === props.authorId ? (
                      <Button.Blue onClick={(event)=>handleShow(event)} className="m-1">
                        Edit
                      </Button.Blue>
                    ) : null}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen ? (
        <Modal
          show={modalOpen}
          size="sm"
          aria-labelledby="contained-modal-title-center"
          centered
          onHide={handleClose}
        >
          <Modal.Header closeButton className="text-md">
            {" "}
            <div className="mb-2 flex">
              <label className="form-label mr-4" for="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={selectedVisiblity}
                onChange={(e) => setSelectedVisiblity(e.target.value)}
                className="form-control"
              >
                <option value={VISIBILITY.LISTED}>Listed</option>
                <option value={VISIBILITY.UNLISTED}>Unlisted</option>
              </select>
            </div>
          </Modal.Header>
          <Modal.Footer>
            <Button.Gray variant="secondary" onClick={(event)=>handleClose(event)}>
              Close
            </Button.Gray>
            <Button.Green
              variant="primary"
              onClick={(event)=>handleSave(event, props.datasetId)}
            >
              Save Changes
            </Button.Green>
          </Modal.Footer>
        </Modal>
      ) : null}
    </div>
  );
}
