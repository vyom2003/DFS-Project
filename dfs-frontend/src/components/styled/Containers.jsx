import React from "react";

const OUTER_CONTAINER_CLASSNAME = "flex flex-col gap-y-7 my-7 w-full px-10";
const OuterContainer = props => <div {...props} className={`${OUTER_CONTAINER_CLASSNAME} ${props.className ?? ''}`}>{props.children}</div>

export const DiscussionsPage = {
    OuterContainer: React.memo(OuterContainer)
}

