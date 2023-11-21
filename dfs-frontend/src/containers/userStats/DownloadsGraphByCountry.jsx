import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { url } from "../../creds";
import { Heading } from "../../components/styled/Text";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const DownloadsGraphByCountry = ({ datasetID }) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [graphData, setGraphData] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [totalDownloadsByAllCountries, setTotalDownloadsByAllCountries] =
    useState([]);
  const [
    totalCountriesInvolvedInDownloads,
    setTotalCountriesInvolvedInDownloads,
  ] = useState([]);
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

  const fetchUniqueYears = async () => {
    try {
      const response = await axios.get(url + "get-unique-years", {
        params: {
          datasetID: datasetID,
        },
      });
      const data = response.data.data;
      setUniqueYears(data);
    } catch (error) {
      console.error("Error fetching unique years:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(url + "get-total-downloads-by-country", {
        params: {
          yearID: selectedYear,
          monthID: selectedMonth,
          datasetID,
        },
      });
      const { totalDownloadsByCountry, totalDownloadsByMonth } =
        response.data.data;
      setGraphData(totalDownloadsByCountry);
      setTotalDownloadsByAllCountries(
        totalDownloadsByMonth.total_dataset_downloads
      );
      // setTotalDownloadsByAllCountries(
      //   totalDownloadsByMonth.total_file_downloads
      // );
      setTotalCountriesInvolvedInDownloads(
        totalDownloadsByMonth.total_countries_month
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUniqueYears();
    fetchData();
  }, [datasetID]);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const options = {
    chart: {
      id: "bar-chart",
      background: "#fdfefe",
    },
    theme: {
      mode: "light",
      palette: "palette1",
      monochrome: {
        enabled: true,
        color: "#0082c8",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    xaxis: {
      categories: graphData.map((data) => data.country_name),
      title: {
        text: `Dataset Downloads Per Countries in ${
          months[selectedMonth - 1]
        } ${selectedYear}`,
        style: {
          fontSize: "16px",
        },
      },
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Dataset Downloads",
        style: {
          fontSize: "16px",
        },
      },
      labels: {
        style: {
          fontSize: "16px",
        },
        formatter: function (value) {
          return Math.round(value);
        },
      },
    },
    colors: ["#031B34"],
  };

  const series = [
    {
      name: "Total File Downloads",
      data: graphData.map((data) => parseInt(data.total_dataset_downloads)),
      // data: graphData.map((data) => parseInt(data.total_file_downloads)),
    },
  ];

  return (
    <div>
      <div className="row px-3">
        <div className="col-md-12 mt-1 p-2 ">
          <div className="mx-4 overflow-x-auto shadow-sm rounded-lg overflow-hidden py-2 bg-gray-100">
            <div className="flex items-center px-1 mt-2 rounded-md outline-none ml-1 block float-left flex-1">
              <Heading size={2} className="">
                <h3>
                  {`Dataset Downloads Per Countries in ${
                    months[selectedMonth - 1]
                  } ${selectedYear}`}
                </h3>
              </Heading>
            </div>
            <div className="flex items-center rounded-md outline-none block float-right flex-1 ml-1 mt-2 mr-2">
              <select value={selectedYear} onChange={handleYearChange}>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center rounded-md outline-none block float-right flex-1 ml-1 mt-2 mr-2">
              <select value={selectedMonth} onChange={handleMonthChange}>
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col  w-full rounded bg-gray-100">
              <div className="row px-4 gap-5 text-center">
                <div className="col-md mt-1 shadow rounded  p-2 bg-gray-200 ">
                  <Heading size={2} className=" text-center">
                    {`Total Dataset Downloads by All Countries in ${
                      months[selectedMonth - 1]
                    } ${selectedYear}`}
                  </Heading>
                  <Heading size={1} className=" text-center">
                    {totalDownloadsByAllCountries !== null
                      ? totalDownloadsByAllCountries
                      : 0}
                  </Heading>
                </div>
                <div className="col-md mt-1 shadow rounded p-2 bg-gray-200">
                  <Heading size={2} className="text-center">
                    {`Total Countries involved in Downloading Dataset in ${
                      months[selectedMonth - 1]
                    } ${selectedYear}`}
                  </Heading>
                  <Heading size={1} className="text-center">
                    {totalCountriesInvolvedInDownloads !== null
                      ? totalCountriesInvolvedInDownloads
                      : 0}
                  </Heading>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-5 my-2 w-full px-3 rounded py-4 bg-gray-100 ">
              {graphData && graphData.length > 0 ? (
                <Chart
                  options={options}
                  series={series}
                  type="bar"
                  height="250%"
                  width="100%"
                />
              ) : (
                <Heading size={2} className="text-center">
                  Data not available
                </Heading>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsGraphByCountry;
