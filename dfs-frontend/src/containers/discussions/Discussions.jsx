import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { withAuth } from "../../withAuth";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../creds";
import { DiscussionSummary } from "../../components/discussions/DiscussionSummary";
import { Button } from "../../components/styled/Buttons";
import { Link } from "react-router-dom";
import { InputField, LargeInputField } from "../../components/styled/Forms";
import { ImageWithLabel } from "../../components/packages/ImageWithLabel";
import { Heading } from "../../components/styled/Text";
import { ToastContext } from "../../App";
import { TOAST_VARIANTS } from "../../packages/toasts/constants";

// move this to a __fixtures__ folder

// export these from styles, lets slowly make all files uniform.
const TD_CLASS = "px-3 py-3 border-b border-gray-200 bg-white text-sm";
const format = "plaintext";
const tags = "issue:danger,ml:primary";

const Discussions = ({ user }) => {
  const { group_id } = useParams();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [discussionList, setdiscussionList] = useState([]);

  const { addToast } = useContext(ToastContext);

  const fetchGroupDiscussions = useCallback(() => {
    axios
      .post(
        url + "group-discussions",
        { group_id },
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        if (!res.data.error) {
          setdiscussionList(res.data.data);
        } else {
          addToast({
            message: "Error in loading discussions",
            variant: TOAST_VARIANTS.WARNING,
          });
        }
      })
      .catch(() => {
        addToast({
          message: "Error",
          variant: TOAST_VARIANTS.WARNING,
        });
      });
  }, [group_id]); // add toqst data later.

  const fetchGroupMembers = useCallback(() => {
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
  }, [group_id]); // fix toast data issue later

  useEffect(() => {
    fetchGroupDiscussions();
    fetchGroupMembers();
  }, [fetchGroupDiscussions, fetchGroupMembers]);

  const isGroupManager = useMemo(() => {
    console.log();
    return data.filter(
      (di) => di.user_id === user.user.user_email && di.user_role === "CREATOR"
    );
  }, [data, user.user.user_email]);

  const createComment = () => {
    axios
      .post(
        url + "create-comment",
        { comment, format, tags, group_id },
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        setComment("");
        fetchGroupDiscussions();
      }).catch(err => {
        // add a toast here.
        console.log('Discussion page create comment error', err);
      });
  };
  // make this div a styled component called OuterContainer
  return (
    <div className="flex flex-col gap-y-7 my-7 w-full px-10">
      <div className="w-full bg-white rounded-xl p-6">
        <div className="flex mb-2">
          <Heading size="2" className="flex-1">
            Group Members
          </Heading>
          {isGroupManager.length > 0 ? (
            <Link
              to={"/group/" + isGroupManager[0].group_id}
              state={{ from: "creater" }}
            >
              <Button.Red>Manage</Button.Red>
            </Link>
          ) : null}
        </div>
        <div style={{ overflowX: "auto" }}>
          {data.length > 0 ? (
            <table className="min-w-full leading-normal table-bordered table-striped">
              <thead>
                <tr>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User Id
                  </th>
                  <th className="px-3 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className={TD_CLASS}>
                    <td className="px-3 py-2">{row.user_id}</td>
                    <td className="px-3 py-2">{row.user_role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
      <div className="w-full bg-slate-200 rounded-xl p-6">
        <Heading size="2" className="mb-3">
          {data?.[0]?.group_name ?? "Group"} Discussions
        </Heading>
        <div className="flex mb-6">
          <ImageWithLabel label={user.user.first_name} />
          <LargeInputField
            placeholder="Create a new discussion"
            className="ml-2 mr-4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex items-end">
          <Button.Green
            className="w-20 border border-slate-50 h-min"
            onClick={(e) => createComment()}
          >
            Create
          </Button.Green>
          </div>
        </div>
        <hr />
        {/* </div> */}
        {discussionList.length > 0
          ? discussionList.map((discussion) => (
              <div className="w-full bg-white rounded-xl p-6 mb-6">
                <DiscussionSummary discussion={discussion} />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default withAuth(Discussions);
