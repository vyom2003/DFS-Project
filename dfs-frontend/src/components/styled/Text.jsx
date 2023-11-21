import React from "react";

export const PlainText = props => <p {...props} className={`text-base text-gray-900 dark:text-white ${props.className ?? ''}`}>{props.children}</p>
export const Heading = props => <h1 {...props} className={`text-${props.size}xl text-gray-900 dark:text-white ${props.className ?? ''}`}>{props.children}</h1>;
