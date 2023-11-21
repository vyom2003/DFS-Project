import React from 'react';


const baseButtonStyle = "font-medium rounded-lg text-sm px-3 py-2 text-center cursor-pointer";
const blueButtonStyle = "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800";
const grayButtonStyle = "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800";
const greenButtonStyle = "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800";
const redButtonStyle = "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900";
const yellowButtonStyle = "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900";
const purpleButtonStyle = "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900";
const cyanButtonStyle = "text-cyan-700 hover:text-white border border-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:border-cyan-400 dark:text-cyan-400 dark:hover:text-white dark:hover:bg-cyan-500 dark:focus:ring-cyan-900";

const ButtonRed = props => <button {...props} className={`${baseButtonStyle} ${redButtonStyle} ${props.className ?? ''}`}>{props.children}</button>
const ButtonBlue = props => <button {...props} className={`${baseButtonStyle} ${blueButtonStyle} ${props.className ?? ''}`}>{props.children}</button>
const ButtonGray = props => <button {...props} className={`${baseButtonStyle} ${grayButtonStyle} ${props.className ?? ''}`}>{props.children}</button>
const ButtonGreen = props => <button {...props} className={`${baseButtonStyle} ${greenButtonStyle} ${props.className ?? ''}`}>{props.children}</button>
const ButtonYellow = props => <button {...props} className={`${baseButtonStyle} ${yellowButtonStyle} ${props.className ?? ''}`}>{props.children}</button>
const ButtonPurple = props => <button {...props} className={`${baseButtonStyle} ${purpleButtonStyle} ${props.className ?? ''}`}>{props.children}</button>
const ButtonCyan = props => <button {...props} className={`${baseButtonStyle} ${cyanButtonStyle} ${props.className ?? ''}`}>{props.children}</button>

const LoaderHollowButton = props => <button {...props} type="button" className={`${baseButtonStyle} text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center ${props.className ?? ''}`}>
  <svg aria-hidden="true" role="status" class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
  </svg>
  {props.children ?? 'Loading...'}
</button>

// const buttonBlueSolidStyle = `className="mb-4 pl-3 pr-3 pb-2.5 pt-2.5 text-white bg-nav-red font-medium text-base border-none outline-none cursor-pointer rounded leading-none"`
// const ButtonBlueSolid = 

export const Button = {
  Red: React.memo(ButtonRed),
  Blue: React.memo(ButtonBlue),
  Gray: React.memo(ButtonGray),
  Green: React.memo(ButtonGreen),
  Yellow: React.memo(ButtonYellow),
  Purple: React.memo(ButtonPurple),
  Cyan: React.memo(ButtonCyan),
  LoadingHollow: React.memo(LoaderHollowButton),
  Empty: props => <button {...props}>{props.children}</button>
}