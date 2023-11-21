import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { url } from "../../creds";
import { Heading } from "../../components/styled/Text";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const UserOrganizationCountGraphByYearMonth = ({ datasetID }) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [totalRegisteredUserInMonth, setTotalRegisteredUserInMonth] =
    useState(null);
  const [totalRegisteredUserInYear, setTotalRegisteredUserInYear] =
    useState(null);
  const [uniqueYears, setUniqueYears] = useState([]);

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
      setRegisteredUsers([]);
      setTotalRegisteredUserInMonth(null);
      setTotalRegisteredUserInYear(null);

      const response = await axios.get(
        url + "get-users-by-organization-month-year",
        {
          params: {
            yearID: selectedYear,
            monthID: selectedMonth,
            datasetID: datasetID,
          },
        }
      );
      const { data, totalRegisteredUserInMonth, totalRegisteredUserInYear } =
        response.data;
      setRegisteredUsers(data);
      setTotalRegisteredUserInMonth(totalRegisteredUserInMonth);
      setTotalRegisteredUserInYear(totalRegisteredUserInYear);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "year") {
      setSelectedYear(parseInt(value));
    } else if (name === "month") {
      setSelectedMonth(parseInt(value));
    }
  };

  useEffect(() => {
    fetchUniqueYears();
    fetchData();
  }, [selectedYear, selectedMonth, datasetID]);

  const options = {
    chart: {
      id: "pie-chart",
      background: "#fdfefe",
    },
    labels: registeredUsers.map((user) => user.user_organization_name),
    title: {
      text: `Registered Users by Organization in ${
        months[selectedMonth - 1]
      } ${selectedYear}`,
      align: "center",
      offsetY: 0,
      offsetX: -240,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#031B34",
      },
    },
    colors: ["#031B34", "#05B137", "#FFC107", "#E91E63", "#2196F3"],
    legend: {
      position: "right",
      fontSize: "16px",
      offsetY: 0,
      offsetX: 150,
      onItemHover: {
        highlightDataSeries: true,
      },
    },
    dataLabels: {
      enabled: true,
      position: "right",
      offsetX: 10,
      style: {
        fontSize: "16px",
      },
    },
    tooltip: {
      style: {
        fontSize: "16px",
      },
    },
  };

  const series = registeredUsers.map((user) => user.total_registered_user);

  return (
    <div>
      <div className="row px-3">
        <div className="col-md-12 mt-1 p-2">
          <div className="mx-4 overflow-x-auto shadow-sm rounded-lg overflow-hidden py-2 bg-gray-100">
            <div className="flex items-center px-1 mt-2 rounded-md outline-none ml-1 block float-left flex-1">
              <Heading size={2}>Registered Users by Organization</Heading>
            </div>
            <div className="flex items-center rounded-md outline-none block float-right flex-1 ml-1 mt-2 mr-2">
              <select name="year" value={selectedYear} onChange={handleChange}>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center rounded-md outline-none block float-right flex-1 ml-1 mt-2 mr-2">
              <select
                name="month"
                value={selectedMonth}
                onChange={handleChange}
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
                  <Heading size={2}>
                    Total Registered Users in {months[selectedMonth - 1]}
                    {selectedYear}
                  </Heading>
                  <Heading size={1}>
                    {totalRegisteredUserInMonth &&
                    totalRegisteredUserInMonth.total_registered_userSum != null
                      ? totalRegisteredUserInMonth.total_registered_userSum
                      : 0}
                  </Heading>
                </div>
                <div className="col-md mt-1 shadow rounded p-2 bg-gray-200">
                  <Heading size={2}>
                    Total Organizations in {months[selectedMonth - 1]}
                    {selectedYear}
                  </Heading>
                  <Heading size={1}>
                    {totalRegisteredUserInMonth &&
                    totalRegisteredUserInMonth.total_organizationCount != null
                      ? totalRegisteredUserInMonth.total_organizationCount
                      : 0}
                  </Heading>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-5 my-2 w-full px-3 rounded py-4 bg-gray-100">
              {options && series && options.labels.length > 0 ? (
                <Chart
                  options={options}
                  series={series}
                  type="pie"
                  height="350%"
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

export default UserOrganizationCountGraphByYearMonth;
