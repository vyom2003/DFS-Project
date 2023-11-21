import React, { useState } from "react";
const CheckPermissions = (given) => {
  const user = localStorage.getItem('dfs-user') ? JSON.parse(localStorage.getItem('dfs-user')) : {};
    if(given === 'ANY')
      return true;
    if(given === 'LOGGED_IN')
      return user.user;
    if(given === 'ADMIN')
      return user.user && user.user.user_role === "admin"; 
    return false;
}
export default CheckPermissions;