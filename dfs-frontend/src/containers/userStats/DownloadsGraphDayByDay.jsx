import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../creds";
import { Heading } from "../../components/styled/Text";
import Chart from "react-apexcharts";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const DayDownloadsStatsGraph = ({
  optionsXAxisCategories,
  optionsXAxisTitleText,
  seriesXAxisData,
}) => {
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
      categories: optionsXAxisCategories,
      title: {
        text: optionsXAxisTitleText,
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
      name: "Dataset Downloads",
      data: seriesXAxisData,
    },
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height="250%"
      width="100%"
    />
  );
};

const DownloadsGraphDayByDay = ({ datasetID }) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [optionsXAxisCategoriesDay, setOptionsXAxisCategoriesDay] = useState(
    []
  );
  const [optionsXAxisTitleTextDay, setOptionsXAxisTitleTextDay] = useState("");
  const [seriesXAxisDataDay, setSeriesXAxisDataDay] = useState([]);
  const [
    totalDatasetDownloadsBySelectedMonth,
    setTotalDatasetDownloadsBySelectedMonth,
  ] = useState(null);
  const [
    totalFileDownloadsBySelectedMonth,
    setTotalFileDownloadsBySelectedMonth,
  ] = useState(null);

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

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  // Fetch the unique years for the dataset
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

  useEffect(() => {
    fetchUniqueYears();
  }, [datasetID]);

  // Fetch the total downloads by day for the dataset
  const getTotalDownloadsByDay = async () => {
    try {
      const response = await axios.get(url + "get-total-downloads-by-day", {
        params: {
          datasetID: datasetID,
          yearID: selectedYear,
          monthID: [selectedMonth],
        },
      });
      const { totalDownloadsByMonth } = response.data;
      setTotalDatasetDownloadsBySelectedMonth(
        totalDownloadsByMonth
          ? totalDownloadsByMonth.total_dataset_downloads
          : 0
      );
      setTotalFileDownloadsBySelectedMonth(
        totalDownloadsByMonth ? totalDownloadsByMonth.total_file_downloads : 0
      );
      const data = response.data.data;
      setOptionsXAxisCategoriesDay(data.map((item) => item.day_id.toString()));
      setOptionsXAxisTitleTextDay(
        `Date - Day downloads for ${months[selectedMonth - 1]} ${selectedYear}`
      );
      setSeriesXAxisDataDay(data.map((item) => item.total_dataset_downloads));
      // setSeriesXAxisDataDay(data.map((item) => item.total_file_downloads));
    } catch (error) {
      console.error("Error fetching total downloads by day:", error);
    }
  };

  useEffect(() => {
    getTotalDownloadsByDay();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="downloads-graph-day-by-day">
      <div className="row px-3">
        <div className="col-md-12 mt-1 p-2 ">
          <div className="mx-4 overflow-x-auto shadow-sm rounded-lg overflow-hidden py-2 bg-gray-100">
            <div className="flex items-center px-1 mt-2 rounded-md outline-none ml-1 block float-left flex-1">
              <Heading size={2} className="">
                <h3>
                  {`Dataset Downloads By Date-Day in ${
                    months[selectedMonth - 1]
                  } ${selectedYear}`}
                </h3>
              </Heading>
            </div>
            <div className="flex items-center rounded-md outline-none block float-right flex-1 ml-1 mt-2 mr-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center rounded-md outline-none block float-right flex-1 ml-1 mt-2 mr-2">
              <select
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full rounded bg-gray-100">
              <div className="row px-4 gap-5 text-center">
                <div className="col-md mt-1 shadow rounded p-2 bg-gray-200">
                  <Heading size={2} className="text-center">
                    {`Total Dataset Downloads in ${
                      months[selectedMonth - 1]
                    } ${selectedYear}`}
                  </Heading>
                  <Heading size={1} className="text-center">
                    {totalDatasetDownloadsBySelectedMonth !== null
                      ? totalDatasetDownloadsBySelectedMonth
                      : 0}
                  </Heading>
                </div>
                {/* <div className="col-md mt-1 shadow rounded p-2 bg-gray-200">
                  <Heading size={2} className="text-center">
                    {`Total File Downloads in ${
                      months[selectedMonth - 1]
                    } ${selectedYear}`}
                  </Heading>
                  <Heading size={1} className="text-center">
                    {totalFileDownloadsBySelectedMonth !== null
                      ? totalFileDownloadsBySelectedMonth
                      : 0}
                  </Heading>
                </div> */}
              </div>
            </div>

            {selectedYear &&
            selectedMonth &&
            optionsXAxisCategoriesDay.length > 0 ? (
              <div className="flex flex-col gap-y-5 my-2 w-full px-3 rounded py-4 bg-gray-100">
                <DayDownloadsStatsGraph
                  optionsXAxisCategories={optionsXAxisCategoriesDay}
                  optionsXAxisTitleText={optionsXAxisTitleTextDay}
                  seriesXAxisData={seriesXAxisDataDay}
                />
              </div>
            ) : (
              <Heading size={2} className="text-center my-8">
                Data not available
              </Heading>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsGraphDayByDay;
