import { Link } from "react-router-dom";
import { USER_STATE } from "../../withAuth";
import { NavItemWithDropdown } from "./NavItemWithDropdown";

export const navItemRenderer = (navItemConfig, pathname, userLoginState, isDropDown=false) => {
  if (
    navItemConfig.permissions === USER_STATE.ADMIN &&
    userLoginState !== USER_STATE.ADMIN
  )
    return null;
  if (
    navItemConfig.permissions === USER_STATE.SIGNED_IN &&
    userLoginState === USER_STATE.ANY
  )
    return null;

  return navItemConfig.options?.length ? (
    // <Link>SOON!</Link>
    <NavItemWithDropdown navItemConfig={navItemConfig} pathname={pathname} isDropDown={isDropDown}/>
  ) : (
    <Link
      className={
        pathname === navItemConfig.pathname ? "text-blue-500" : "text-white"
      }
      to={navItemConfig.pathname}
    >
      {navItemConfig.name}
    </Link>
  );
};

export const getLogoutButton = (navigate) => (
  <button
    className="pl-3 pr-3 pb-2.5 pt-2.5 text-white bg-nav-red font-medium text-base border-none outline-none cursor-pointer rounded leading-none"
    type="button"
    onClick={(e) => {
      localStorage.removeItem("dfs-user");
      return navigate("/sign-in");
    }}
  >
    <span>Logout</span>
  </button>
);

export const NavButton = ({ children }) => (
  <button
    className="py-2 px-3 text-white bg-nav-red border-none outline-none cursor-pointer rounded"
    type="button"
  >
    {children}
  </button>
);
