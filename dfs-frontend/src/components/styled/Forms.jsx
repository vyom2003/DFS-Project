import React from "react"

const inputFieldClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

export const InputField = props => <input {...props} className={`${inputFieldClass} ${props.className ?? ''} ${props.type === 'checkbox' ? '' : 'w-full'}`} />

export const LargeInputField = props => <textarea {...props} rows={props.rows ?? "4"} className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className ?? ''}`} />
