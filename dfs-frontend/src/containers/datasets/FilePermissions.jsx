import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Heading, PlainText } from "../../components/styled/Text";
import { useEffect, useContext } from "react";
import axios from "axios";
import { url } from "../../creds";
import { useState } from "react";
import { Button } from "../../components/styled/Buttons";
import { Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Table from "react-bootstrap/Table";
import DatasetVersionDetails from "./DatasetVersionDetails";
import { Modal } from "react-bootstrap";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";
import { ConfirmationModal } from "../../components/confirmationModal/ConfirmationModal";
import { MODAL_VARIANTS } from "../../components/confirmationModal/constants";

const user = localStorage.getItem("dfs-user")
  ? JSON.parse(localStorage.getItem("dfs-user"))
  : {};
const TH_CNAME =
  "px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider";

const TR_CLASS = "px-3 py-3 border-b border-gray-200 bg-white text-sm";

export default function FilePermission() {
  const { fileData } = useLocation().state;
  const { filename } = useParams();
  const [data, setData] = useState([]);
  const [group, setGroupData] = useState({});
  const [selGroup, setSelGroupData] = useState({});

  const [persData, setPersData] = useState({});
  const [check, setCheck] = useState(0);
  const [modal, setModal] = useState(0);
  const [groupID, setGroupID] = useState("");

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { addToast } = useContext(ToastContext);

  const navigate = useNavigate();

  const getDownReq = () => {
    axios
      .get(url + "download-req-status-to-version", {
        params: { upfilename: filename },
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        setData(res.data);
      });
  };
  const getGroupData = (id) => {
    axios
      .get(url + "group-members", {
        params: { group_id: id },
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        setSelGroupData(res.data.data);
      })
      .catch((err) => {
        addToast({
          message: "Error " + err,
          variant: TOAST_VARIANTS.ERROR,
        });
      });
  };
  const getPersonalData = (email) => {
    axios
      .get(url + "get-user-details", {
        params: { email },
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        setPersData(res.data);
      })
      .catch((err) => {
        addToast({
          message: "Error " + err,
          variant: TOAST_VARIANTS.ERROR,
        });
      });
  };
  useEffect(() => {
    getDownReq();
  }, []);
  useEffect(() => {
    axios
      .get(url + "groups?creator=" + user.user.user_email, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        setGroupData(res.data.data);
        setCheck(1);
      });
  }, []);
  const deleteRequest = (ID, index) => {
    axios
      .get(url + "query-delete-request", {
        params: { upfilename: filename, email: ID },
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        setData(data.filter((v, i) => i !== index));
        addToast({
          message: "Group Permission Deleted",
          variant: TOAST_VARIANTS.SUCCESS,
        });
      });
  };
  const grantPermission = () => {
    axios
      .post(url + "query-add-group-dataset-request", {
        upfilename: filename,
        upfilenameMD: fileData.upfilenameMD,
        author: fileData.author_id,
        comment: "Self Assigned",
        groupID: groupID,
        email: user.user.user_email,
      })
      .then((res) => {
        getDownReq();
        addToast({
          message: "Group Granted Permission Successfully",
          variant: TOAST_VARIANTS.SUCCESS,
        });
      });
  };

  const deleteVersion = () => {
    axios
      .delete(url + "delete-file", {
        params: { id: filename },
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        addToast({
          message: "File Deleted Successfully",
          variant: TOAST_VARIANTS.SUCCESS,
        });
        navigate("/my-data");
      })
      .catch((err) => {
        addToast({
          message: "Error " + err,
          variant: TOAST_VARIANTS.ERROR,
        });
      });
  };

  return (
    <>
      <div className="flex flex-col gap-y-7 my-7 w-full px-10">
        <div>
          <DatasetVersionDetails data={fileData} />
        </div>
        <div className="w-full bg-white rounded-xl p-6">
          <Heading>Granted Permissions</Heading>
          <table className="min-w-full leading-normal table-bordered table-striped">
            <thead>
              <tr>
                <th className={TH_CNAME}>Id</th>
                <th className={TH_CNAME}>Type</th>
                <th className={TH_CNAME}>Comment</th>
                <th className={TH_CNAME}>Status</th>
                <th className={TH_CNAME}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 &&
                data.map((row, index) => (
                  <tr key={index} className={TR_CLASS}>
                    <td className="px-3 py-2">{row.requester}</td>
                    <td className="px-3 py-2">
                      {row.requester.includes("@") ? "User" : "Group"}
                    </td>
                    <td
                      className={
                        row.requester.includes("@")
                          ? "px-3 py-2"
                          : "text-green-700 px-3 py-2 font-bold"
                      }
                    >
                      {row.requester.includes("@")
                        ? row.comment
                        : "Self Assigned"}
                    </td>
                    <td className="px-3 py-2">{row.stat}</td>
                    <td className="px-3 py-2">
                      <Button.Red
                        className="mr-4"
                        onClick={() => deleteRequest(row.requester, index)}
                      >
                        Delete Request
                      </Button.Red>
                      {row.requester.includes("@") ? (
                        <Button.Yellow
                          onClick={() => {
                            setModal(1);
                            getPersonalData(row.requester);
                          }}
                        >
                          View Member
                        </Button.Yellow>
                      ) : (
                        <Button.Yellow
                          onClick={() => {
                            setModal(2);
                            getGroupData(row.requester);
                          }}
                        >
                          View Group
                        </Button.Yellow>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {modal > 0 && (
            <div>
              {(selGroup.length > 0 && modal === 2) ||
              (persData.length > 0 && modal === 1) ? (
                <Modal
                  show={modal}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  onHide={() => setModal(0)}
                >
                  <Modal.Header closeButton>
                    <Table className="min-w-full leading-normal table-bordered table-striped table-fixed">
                      <Thead>
                        <tr>
                          <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {modal === 2 ? "Group ID" : "Name"}
                          </Th>
                          <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {modal === 2 ? "Group Name" : "Institution"}
                          </Th>
                          <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {modal === 2 ? "User ID" : "Role"}
                          </Th>
                          {modal === 1 ? (
                            <Th className="px-3 py-3 break-words border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              {"Designation"}
                            </Th>
                          ) : null}
                        </tr>
                      </Thead>
                      <Tbody>
                        {modal === 2
                          ? selGroup.map((data, index) => (
                              <tr>
                                <Td className="px-3 py-3 break-words border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data.group_id}
                                  </p>
                                </Td>
                                <Td className="px-3 py-3 break-words border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data.group_name}
                                  </p>
                                </Td>
                                <Td className="px-3 py-3 border-b break-words border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data.user_id}
                                  </p>
                                </Td>
                              </tr>
                            ))
                          : persData.map((data, index) => (
                              <tr>
                                <Td className="px-3 py-3 break-words border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data.first_name + " " + data.last_name}
                                  </p>
                                </Td>
                                <Td className="px-3 py-3 break-words border-b border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data.institution}
                                  </p>
                                </Td>
                                <Td className="px-3 py-3 border-b break-words border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data.user_role}
                                  </p>
                                </Td>
                                <Td className="px-3 py-3 border-b break-words border-gray-200 bg-white text-sm">
                                  <p className="text-gray-900 whitespace-no-wrap">
                                    {data.designation}
                                  </p>
                                </Td>
                              </tr>
                            ))}
                      </Tbody>
                    </Table>
                  </Modal.Header>
                </Modal>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-7 my-7 w-full px-10">
        <div className="w-full bg-white rounded-xl p-6">
          <Heading>Grant Permission</Heading>
          <PlainText className="mb-0">Groups</PlainText>

          <div className="flex justify-center">
            <div className="mb-3 w-full">
              <select
                onChange={(e) => setGroupID(e.target.value)}
                className="w-full form-select appearance-none block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label="Default select example"
              >
                <option selected disabled>
                  Open this select menu
                </option>
                {check === 1 &&
                  group.map((data, index) => (
                    <option value={data.group_id}>{data.group_name}</option>
                  ))}
              </select>
            </div>
          </div>
          <Button.Green
            disabled={groupID === ""}
            onClick={() => grantPermission()}
            className="float-right mt-2"
          >
            Grant Permission
          </Button.Green>
        </div>
      </div>
      <div className="flex flex-col gap-y-7 my-7 w-full px-10">
        <div className="w-full bg-white rounded-xl p-6">
          <Heading>Manage</Heading>
          <Button.Red
            onClick={() => {
              setShowConfirmationModal(true);
            }}
            className="mt-2"
          >
            Delete
          </Button.Red>
          <PlainText className="mt-2 ml-2">
            Warning: this action cannot be reversed. All associated files and
            permissions will be deleted.
          </PlainText>
          {showConfirmationModal && (
            <ConfirmationModal
              intent={MODAL_VARIANTS.DANGER}
              message={`Are you sure you want to delete dataset version : ${fileData.version_name} ?`}
              onCancel={() => {
                setShowConfirmationModal(false);
              }}
              onSuccess={deleteVersion}
            />
          )}
        </div>
      </div>
    </>
  );
}
