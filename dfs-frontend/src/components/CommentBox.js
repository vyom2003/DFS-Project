export function CommentBox(props) {
    return (
         <div class="shadow-md">
            <form action="" class="w-full p-4">
                <div class="mb-2">
                <label for="comment" class="text-lg text-gray-600">Add a comment</label>
                <textarea class="w-full h-20 p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                    name="comment" placeholder=""></textarea>
                </div>
                {props.button}
            </form>
        </div>
    )
  }

export function CommentButton(props) {
    return (
        <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={props.onClick}
                >
                  Comment
                </button>
    )
}