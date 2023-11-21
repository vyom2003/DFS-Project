import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../creds";
import { Heading } from "../../components/styled/Text";
import TotalDownloadsStats from "./TotalDownloadsStats";
import TotalDownloadsStatsGraph from "./TotalDownloadsStatsGraph";
import TotalDownloadsStatsByYears from "./TotalDownloadsStatsByYears";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const startYear = 2018;

const DownloadsGraphByYearMonth = ({ datasetID }) => {
  // State for Total Downloads
  const [totalDownloads, setTotalDownloads] = useState([]);
  const [totalDatasetDownloads, setTotalDatasetDownloads] = useState([]);
  const [totalDatasetFileDownloads, setTotalFileDownloads] = useState([]);
  const [totalRegUsers, setTotalRegUsers] = useState([]);
  const [totalRegOrganizations, setTotalRegOrganizations] = useState([]);
  const [totalRegCountries, setTotalRegCountries] = useState([]);

  // State for Total Downloads By Year
  const [selectedYear, setSelectedYear] = useState("");
  const [totalDownloadsByYear, setTotalDownloadsByYear] = useState([]);
  const [optionsXAxisCategories, setOptionsXAxisCategories] = useState([]);
  const [optionsXAxisTitleText, setOptionsXAxisTitleText] = useState("");
  const [seriesXAxisData, setSeriesXAxisData] = useState([]);

  // State for Total Downloads By Month
  const [totalDatasetDownloadsByYears, setTotalDatasetDownloadsByYears] =
    useState([]);
  const [
    totalDatasetFileDownloadsByYears,
    setTotalDatasetFileDownloadsByYears,
  ] = useState([]);
  const [totalRegUsersByYears, setTotalRegUsersByYears] = useState([]);
  const [totalRegOrganizationsByYears, setTotalRegOrganizationsByYears] =
    useState([]);
  const [totalRegCountriesByYears, setTotalRegCountriesByYears] = useState([]);

  // Fetch total downloads
  const getTotalDownloads = async () => {
    try {
      const response = await axios.get(url + "get-total-downloads", {
        params: {
          datasetID,
        },
      });
      setTotalDownloads(response.data.data);
      setTotalDatasetDownloads(
        response.data.data.map((item) =>
          item.total_dataset_downloads.toString()
        )
      );
      setTotalFileDownloads(
        response.data.data.map((item) => item.total_file_downloads.toString())
      );
      setTotalRegUsers(
        response.data.data.map((item) => item.total_users.toString())
      );
      setTotalRegOrganizations(
        response.data.data.map((item) => item.total_organizations.toString())
      );
      setTotalRegCountries(
        response.data.data.map((item) => item.total_countries.toString())
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch total downloads by year
  const getTotalDownloadsByYear = async () => {
    try {
      const response = await axios.get(url + "get-total-downloads-by-year", {
        params: {
          datasetID,
          startYear,
          currentYear,
        },
      });
      setTotalDownloadsByYear(response.data.data);
      setOptionsXAxisCategories(
        response.data.data.map((item) => item.year_id.toString())
      );
      setOptionsXAxisTitleText("Download stats for All Years");
      setSeriesXAxisData(
        response.data.data.map((item) => parseInt(item.total_dataset_downloads))
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch total downloads by month
  const getTotalDownloadsByMonth = async (value) => {
    try {
      const response = await axios.get(url + "get-total-downloads-by-month", {
        params: {
          datasetID,
          startYear: value,
          currentYear: value,
        },
      });
      setOptionsXAxisCategories(
        response.data.data.map((item) => months[item.month_id - 1])
      );
      setOptionsXAxisTitleText("Monthly downloads stats for selected year");
      setSeriesXAxisData(
        response.data.data.map((item) => parseInt(item.total_dataset_downloads))
      );
      // setSeriesXAxisData(
      //   response.data.data.map((item) => parseInt(item.total_file_downloads))
      // );
      setTotalDatasetDownloadsByYears(response.data.total_dataset_downloads_all_years);
      setTotalDatasetFileDownloadsByYears(
        response.data.total_file_downloads_all_years
      );
      setTotalRegUsersByYears(response.data.total_users_all_years);
      setTotalRegOrganizationsByYears(
        response.data.total_organizations_all_years
      );
      setTotalRegCountriesByYears(response.data.total_countries_all_years);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedYear(value);
    if (value === "allYears" || value === null) {
      getTotalDownloadsByYear();
    } else {
      getTotalDownloadsByMonth(value);
    }
  };

  useEffect(() => {
    getTotalDownloads();
    getTotalDownloadsByYear();
    getTotalDownloadsByMonth(currentYear);
  }, []);

  useEffect(() => {
    getTotalDownloadsByYear();
  }, []);

  return (
    <div className="row px-3">
      <div className="col-md-12 mt-1 p-2">
        <div className="mx-4 overflow-x-auto shadow-sm rounded-lg overflow-hidden py-2 bg-gray-100">
          <div className="flex items-center px-1 mt-2 rounded-md outline-none ml-1 block float-left flex-1">
            <Heading size={2}>
              <h3>
                Total Download Stats of{" "}
                {
                  totalDownloads.find((item) => datasetID === item.dataset_id)
                    ?.dataset_name
                }
              </h3>
            </Heading>
          </div>
          <div className="flex items-center rounded-md outline-none block float-right flex-1 ml-1 mt-2 mr-2">
            <select
              id="monthYear"
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              <option value="allYears">All Years</option>
              {totalDownloadsByYear.map((item) => (
                <option key={item.year_id} value={item.year_id}>
                  {item.year_id}
                </option>
              ))}
            </select>
          </div>

          {selectedYear === "allYears" || selectedYear === "" ? (
            <div className="flex flex-col gap-y-5 my-7 w-full px-3 rounded py-4 bg-gray-100 ">
              <TotalDownloadsStats
                totalDatasetDownloads={totalDatasetDownloads}
                totalDatasetFileDownloads={totalDatasetFileDownloads}
                totalRegUsers={totalRegUsers}
                totalRegOrganizations={totalRegOrganizations}
                totalRegCountries={totalRegCountries}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-y-5 my-7 w-full px-3 rounded py-4 bg-gray-100 ">
              <TotalDownloadsStatsByYears
                totalDatasetDownloads={totalDatasetDownloadsByYears}
                totalDatasetFileDownloads={totalDatasetFileDownloadsByYears}
                totalRegUsers={totalRegUsersByYears}
                totalRegOrganizations={totalRegOrganizationsByYears}
                totalRegCountries={totalRegCountriesByYears}
              />
            </div>
          )}
          {optionsXAxisCategories.length > 0 ? (
            <TotalDownloadsStatsGraph
              optionsXAxisCategories={optionsXAxisCategories}
              optionsXAxisTitleText={optionsXAxisTitleText}
              seriesXAxisData={seriesXAxisData}
            />
          ) : (
            <Heading size={2} className="text-center my-8">
              Data not available
            </Heading>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadsGraphByYearMonth;