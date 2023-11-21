//libs
import { forwardRef } from 'react';

// hooks
import { useNavigate } from "react-router-dom";

const getUser = () => {
  const user = JSON.parse(localStorage.getItem('dfs-user'));
  if(!user?.token || new Date() > new Date(user.validTill)){
    if(user){ localStorage.removeItem('dfs-user'); }
    return null;
  }
  return user;
};

const withAuth = (Component) =>
  forwardRef((props, ref) => {
    const navigate = useNavigate();
    const user = getUser();
    if(!user){
      return navigate('/sign-in');
    }
    return (
      <Component
        {...props}
        user={user}
        ref={ref}
      />
    );
  });

const USER_STATE = {
  ANY : 'ANY',
  ADMIN : 'ADMIN',
  SIGNED_IN : 'SIGNED_IN',
}
  
const getUserLoginState = (user, _getUser = false) => { // returns most specific access
  let targetUser = user;
  if(!_getUser){
    targetUser = getUser();
  }
  if(targetUser) {
    if(targetUser.user?.user_role === "admin") return USER_STATE.ADMIN;
    return USER_STATE.SIGNED_IN;
  }
  return USER_STATE.ANY;
}
  
export { withAuth, getUser, USER_STATE, getUserLoginState };
