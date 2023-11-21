import React from "react";
import { withAuth } from "../../withAuth";

const DiscussionGroupDescriptionPageWithoutAuth = ({group_id}) => {
  return <h1>DiscussionsPageDescription!!</h1>
};

export const DiscussionGroupDescriptionPage = withAuth(DiscussionGroupDescriptionPageWithoutAuth);