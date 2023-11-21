import React from "react";
import { ImageWithLabel } from "../packages/ImageWithLabel";
import { PlainText } from "../styled/Text";
import Linkify from 'react-linkify';
import moment from "moment";

export const DiscussionComment = ({comment}) => {
  const curr_date = +new Date();
  const result = moment(curr_date).diff(moment(comment.comment_date));
  const hoursAgo = moment.duration(result).humanize();
  
  return <div className="flex">
    <ImageWithLabel label={comment.alias}/>
    <div className="flex-1 ml-1.5">
      <PlainText size={1} className="font-bold h-8 flex items-center mb-0.5">{comment.alias}</PlainText>
      <PlainText size={1} className="mb-px"><Linkify>{comment.comment}</Linkify></PlainText>
      {/* Use moment.js for this and add a title to this. x hrs ago / x days ago / comment date in format like : 5 march, 2021 */}
      <PlainText size={0.5} className="text-sm font-weight-300 mt-2 opacity-50" title={moment(comment.comment_date).format('MMMM Do YYYY, h:mm:ss a')}>&gt; 
      {moment(comment.comment_date).format('MMMM Do YYYY, ')} {hoursAgo} ago </PlainText>
    </div>
  </div>
}