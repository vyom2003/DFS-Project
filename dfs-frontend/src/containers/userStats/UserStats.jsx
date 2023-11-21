import React from "react";
import DownloadsGraphByCountry from "./DownloadsGraphByCountry";
import DownloadsGraphDayByDay from "./DownloadsGraphDayByDay";
import DownloadsGraphByYearMonth from "./DownloadsGraphByYearMonth";
import UserOrganizationCountGraphByYearMonth from "./UserOrganizationCountGraphByYearMonth";

const UserStats = () => {
  const currentURL = window.location.href;
  const parts = currentURL.split("/");
  const datasetID = parts[parts.length - 1];

  return (
    <>
      {/* Total Dataset Downloads By Year and Month */}
      <DownloadsGraphByYearMonth datasetID={datasetID} />

      {/* Total Dataset Downloads By Day */}
      <DownloadsGraphDayByDay datasetID={datasetID} />

      {/* Total Dataset Downloads By Country */}
      <DownloadsGraphByCountry datasetID={datasetID} />

      {/* Total User By Organizations */}
      <UserOrganizationCountGraphByYearMonth datasetID={datasetID} />
    </>
  );
};

export default UserStats;
