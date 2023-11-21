import React, { useState } from "react";
import { withAuth } from "../../withAuth";
import { ImageWithLabel } from "../packages/ImageWithLabel";
import { DiscussionComment } from "./DiscussionComment";
import { useParams } from "react-router-dom";
import { Button } from "../styled/Buttons";
import { InputField } from "../styled/Forms";
import { useEffect } from "react";
import axios from "axios";
import { url } from "../../creds";

const format = "plaintext";
const tags = "issue:danger,ml:primary";

const DiscussionSummaryWithoutAuth = ({ discussion, key, user }) => {
  const { group_id } = useParams();
  const [comment, setComment] = useState("");
  const discussion_id = discussion["discussion_id"];
  const [replies, setReplies] = React.useState([]);
  const getDiscussions = (discussion_id) => {
    axios
      .post(
        url + "discussion",
        { group_id, discussion_id },
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        setReplies(res.data.data.reverse());  // to remove the discussion comment, fix from backend later and sort all by correct date order
      });
  };
  const [askedForViewMore, setAskedForViewMore] = React.useState(false);

  const addComment = (discussion_id) => {
    axios
      .post(
        url + "add-comment",
        { discussion_id, comment, format, tags, group_id },
        {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("dfs-user"))["token"],
          },
        }
      )
      .then((res) => {
        setComment("");
        getDiscussions(discussion_id);
        setAskedForViewMore(true);
      });
  };
  return (
    <div>
      <div className="border-l-4 border-indigo-500 pl-2 mb-1">
        <DiscussionComment comment={discussion} />
      </div>
      {/* {!askedForViewMore ? <Link className="text-sky-500" onClick={e=>console.log('ASDFASDF')}>View More replies</Link> : <h1>ASDF</h1>} */}
      {/* {!askedForViewMore ? <Button className="text-sky-500">View More replies</Link> : <h1>ASDF</h1>} */}
      {!askedForViewMore ? (
        <Button.Empty
          className="text-sky-500 hover:text-sky-600 hover:underline"
          onClick={() => {
            getDiscussions(discussion_id);
            setAskedForViewMore(true);
          }}
        >
          View More replies
        </Button.Empty>
      ) : (
        <div className="ml-4 max-h-64 overflow-auto">
          {/* <Button.Empty className="text-sky-500 hover:text-sky-600 hover:underline"> */}
          {/* View All */}
          {/* </Button.Empty> */}
          {replies.length > 0
            ? replies.map((reply, index) => (
                <div
                  className={`border-l-4 border-indigo-500 pl-2 mb-1 ${
                    index % 2 ? "border-red-500" : ""
                  }`}
                >
                  <DiscussionComment comment={reply} />
                </div>
              ))
            : null}
        </div>
      )}
      <hr />
      <div className="flex items-center">
        <ImageWithLabel label={user.user.first_name} />
        <InputField
          placeholder="add a comment"
          className="ml-2 mr-4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button.Green
          className="w-20"
          onClick={(e) => addComment(discussion_id)}
        >
          Add
        </Button.Green>
      </div>
      {/* <div className="flex items-center flex-row-reverse mt-1"> */}
      {/* <label for="ismdcheckbox" className="mb-0 ml-2"> */}
      {/* use MD */}
      {/* </label> */}
      {/* <input type="checkbox" id="ismdcheckbox" disabled /> */}
      {/* </div> */}
    </div>
  );
};

export const DiscussionSummary = withAuth(DiscussionSummaryWithoutAuth);
