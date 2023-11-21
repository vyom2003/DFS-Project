import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { url } from "../../creds";
import { Heading } from "../../components/styled/Text";
import { Button } from "../../components/styled/Buttons";
import { Link, Navigate } from "react-router-dom";
import { useCallback } from "react";
import { InputField } from "../../components/styled/Forms";
import { PlainText } from "../../components/styled/Text";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";


const TD_CLASS = "px-3 py-3 border-b border-gray-200 bg-white text-sm";

export default function Group() {
  const navigate = useNavigate();
  const { from } = useLocation().state;
  const { group_id } = useParams();
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("view");
  const [emailID, setEmailId] = useState("");
  const [deleteInProgress, setProgress] = useState(0);
  const userToken = localStorage.getItem("dfs-user")?.["token"]

  const { addToast } = useContext(ToastContext);

  const fetchData = useCallback(() => {
    axios
      .get(url + "group-members?group_id=" + group_id, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        addToast({
          message: "error loading group",
          variant: TOAST_VARIANTS.WARNING,
      });
      });
  }, [group_id, mode, addToast]);

  useEffect(() => {
    // if(userToken) {
      fetchData()
    // };
  }, [group_id, fetchData]);

  // if(!userToken){
  //   return <Navigate to="/sign-in" replace={true} />;
  // }

  return (
    <div className="flex flex-col gap-y-7 my-7 w-full px-10">
      <div className="w-full bg-white rounded-xl p-6">
        {mode === "view" ? (
          <>
            <div className="flex">
              <Heading size={1} className="flex-1">
                Group: {data[0]?.group_name ?? group_id}
              </Heading>
              {from === "creater" ? (
                <Button.Blue onClick={() => setMode("add")}>
                  Add a Member
                </Button.Blue>
              ) : null}
            </div>

            <div style={{ overflowX: "auto" }}>
              {data.length > 0 ? (
                <table className="min-w-full leading-normal table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      {from === "creater" ? (
                        <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index} className={TD_CLASS}>
                        <td className="px-3 py-2">{row.user_id}</td>
                        <td className="px-3 py-2">{row.user_role}</td>
                        {from === "creater" ? (
                          <td className="px-3 py-2">
                            {row.user_role !== "CREATOR" ||
                            data.length === 1 ? (
                              <Button.Red disabled={deleteInProgress}
                                onClick={() => {
                                  setProgress(1);
                                  axios
                                    .post(
                                      url + "remove-from-group",
                                      {
                                        groupId: row.group_id,
                                        email: row.user_id,
                                      },
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
                                    .finally((res) => {
                                      setProgress(0);
                                      fetchData();
                                      if (
                                        data.length === 0 ||
                                        row.user_role === "CREATOR"
                                      ) {
                                        navigate("/groups");
                                      }
                                    });
                                }}
                              >
                                Delete
                              </Button.Red>
                            ) : (
                              <Button.Gray disabled>
                                Cant Delete Non-Empty Group
                              </Button.Gray>
                            )}
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Link to="/groups">
                  Group has been deleted, click here to go back.
                </Link>
              )}
            </div>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              axios
                .post(
                  url + "add-to-group",
                  { groupId: group_id, email: emailID },
                  {
                    headers: {
                      Authorization:
                        "Bearer " +
                        JSON.parse(localStorage.getItem("dfs-user"))["token"],
                    },
                  }
                )
                .then((res) => {
                  e.preventDefault();
                  setMode("view");
                  addToast({
                    message: "Member added succefully",
                    variant: TOAST_VARIANTS.SUCCESS
                  });
                })
                .catch((err) => {
                  e.preventDefault();
                  addToast({
                    message: "error adding member",
                    variant: TOAST_VARIANTS.WARNING
                  });
                });
            }}
          >
            <div className="flex">
              <Heading size={2} className="mb-4 flex-1">
                Add a new member
              </Heading>
              <Button.Green disabled={deleteInProgress}
                onClick={(e) => {
                  e.preventDefault();
                  setMode("view");
                }}
                className="min-h-min"
              >
                Go Back
              </Button.Green>
            </div>

            <PlainText className="mb-0">Email Id of new member</PlainText>
            <InputField
              placeholder="Enter the email id of the new member"
              required
              value={emailID}
              onChange={(e) => setEmailId(e.target.value)}
            />
            <div className="text-right mt-2">
              <Button.Blue disabled={deleteInProgress}>Add</Button.Blue>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
