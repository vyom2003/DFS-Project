import React from "react";
import { Heading } from "../../components/styled/Text";

// Total Downloads Stats Component
const TotalDownloadsStats = ({
  totalDatasetDownloads,
  totalDatasetFileDownloads,
  totalRegUsers,
  totalRegOrganizations,
  totalRegCountries,
}) => {
  return (
    <div className="flex flex-col  w-full rounded bg-gray-100">
      <div className="row px-2 gap-5 text-center">
        <div className="col-md mt-1 shadow rounded  p-2 bg-gray-200 ">
          <Heading size={2} className=" text-center">
            Total Dataset Downloads
          </Heading>
          <Heading size={1} className=" text-center">
          {totalDatasetDownloads.length === 0 ? 0 : totalDatasetDownloads}
          </Heading>
        </div>
        {/* <div className="col-md mt-1 shadow rounded  p-2 bg-gray-200 ">
          <Heading size={2} className=" text-center">
            Total File Downloads
          </Heading>
          <Heading size={1} className=" text-center">
            {totalDatasetFileDownloads}
          </Heading>
        </div> */}
        <div className="col-md mt-1 shadow rounded p-2 bg-gray-200">
          <Heading size={2} className="text-center">
            Total Users
          </Heading>
          <Heading size={1} className="text-center">
            {totalRegUsers.length === 0 ? 0 : totalRegUsers}
          </Heading>
        </div>
        <div className="col-md mt-1 shadow rounded p-2 bg-gray-200">
          <Heading size={2} className=" text-center">
            Total Organization
          </Heading>
          <Heading size={1} className="text-center">
            {totalRegOrganizations.length === 0 ? 0 : totalRegOrganizations}
          </Heading>
        </div>
        <div className="col-md mt-1 shadow rounded p-2 bg-gray-200">
          <Heading size={2} className=" text-center">
            Total Countries
          </Heading>
          <Heading size={1} className="text-center">
            {totalRegCountries.length === 0 ? 0 : totalRegCountries}
          </Heading>
        </div>
      </div>
    </div>
  );
};
export default TotalDownloadsStats;