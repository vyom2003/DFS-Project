import React from "react";
import Comment from "../../components/Comment";
import { CommentBox, CommentButton } from "../../components/CommentBox";
// import { comments } from "../../temp_data";

const CommentsPage = ({datasetID} : {datasetID? : string}) => {

    return (
      <>
        <CommentBox button={<CommentButton />}/>
          {/* {comments.map((comment) => <Comment comment={comment} level={0}/>)} */}
      </>
    )
}

export default CommentsPage;