import { useState } from "react"
import Popup from "./Popup"
import { CommentBox, CommentButton } from "./CommentBox"

export default function Comment(props) {
    const [reply, setReply] = useState(false);
    const [level, setLevel] = useState(props.level);

    return (
      <>
        <div className="px-8 py-4 md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{props.comment.author}</h3>
            <p className="mt-1 text-sm text-gray-600">{props.comment.text}</p>
          </div>
        </div>
        {level < 4 &&
        <div className="bg-white overflow-hidden sm:rounded-lg px-8">
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 justify-end pr-16">
            <div className="ml-4 flex-shrink-0" onClick={() => setReply(true)}>
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Reply
              </a>
            </div>
            <div className="ml-4 flex-shrink-0">
              <a href="#" className="font-medium text-red-600 hover:text-red-300">
              Delete
              </a>
            </div>
          </div>
        </div>
        }
        <div className="pl-8">
        {props.comment.replied === true && <Comment comment={props.comment.reply} level={level+1}/>}
        </div>
        <Popup open={[reply, setReply]} component={CommentBox} button={<CommentButton />} />
        {level === 0 && 
        <div aria-hidden="true">
          <div className="py-3">
          <div className="border-t border-gray-200" />
          </div>
        </div>}
      </>
    )
  }
  