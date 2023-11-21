import { USER_STATE } from "../../withAuth";

export const NAV_CONFIG = [
  {
    name: "My Data",
    pathname: "/my-data",
    permissions: USER_STATE.SIGNED_IN,
  },
  {
    name: "Datasets",
    pathname: "/datasets",
    permissions: USER_STATE.ANY,
    options: [],
  },
  {
    name: "Verify Datasets",
    pathname: "/verify",
    permissions: USER_STATE.ADMIN,
    options: [],
  },
  {
    name: "Domains",
    pathname: "/domain",
    permissions: "ADMIN",
    options: [],
  },
];
