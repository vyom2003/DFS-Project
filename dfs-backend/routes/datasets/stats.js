const express = require("express");
const router = express.Router();
const { execSql } = require("../../db");

// Table-1: Total Dataset Download Count get using dataset_id
router.get("/api/get-total-downloads", (req, res) => {
  //console.log("Total Dataset Downloads ");
  //const { datasetID="453982e4-3ff8-4785-8d49-f887c8f4b48a" } = req.query;
  const { datasetID } = req.query;
  if (datasetID != null) {
    const QUERY_DOWNLOAD_DETAILS =
      "SELECT * FROM TotalDownloads WHERE dataset_id = ?";
    execSql(QUERY_DOWNLOAD_DETAILS, [datasetID])
      .then((sqlres) => {
        res.send({
          error: false,
          data: sqlres,
        });
        console.log(sqlres);
      })
      .catch((err) => {
        console.log(err.code);
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data: err,
        });
      });
  } else {
    res
      .status(401)
      .json({ error: true, message: "Dataset count not available" });
  }
});

// Table-2: Get Total_Downloads_By_Year
router.get("/api/get-total-downloads-by-year", (req, res) => {
  //console.log("Total Downloads By Year");
  //const { datasetID = "453982e4-3ff8-4785-8d49-f887c8f4b48a", startYear = 2018, currentYear = 2023 } = req.query;
  const { startYear, currentYear, datasetID } = req.query;
  if (datasetID !== null) {
    const QUERY_DOWNLOAD_DETAILS =
      "SELECT year_id, SUM(total_file_downloads) AS total_file_downloads, SUM(total_dataset_downloads) AS total_dataset_downloads FROM TotalDownloadsMonthYear WHERE year_id BETWEEN ? AND ? AND dataset_id = ? GROUP BY year_id";
    execSql(QUERY_DOWNLOAD_DETAILS, [startYear, currentYear, datasetID])
      .then((sqlres) => {
        res.send({
          error: false,
          data: sqlres,
        });
        console.log(sqlres);
      })
      .catch((err) => {
        console.log(err.code);
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data: err,
        });
      });
  } else {
    res.status(401).json({ error: true, message: "Dataset not available" });
  }
});


// Table-2: Get Total_Downloads_By_Month
router.get("/api/get-total-downloads-by-month", (req, res) => {
  //console.log("Total Downloads By Month");
  //const { datasetID = "453982e4-3ff8-4785-8d49-f887c8f4b48a", startYear = 2018, currentYear = 2023 } = req.query;
  const { startYear, currentYear, datasetID } = req.query;
  if (datasetID != null) {
    const QUERY_DOWNLOAD_DETAILS = `
      SELECT year_id, month_id, SUM(total_file_downloads) AS total_file_downloads, SUM(total_dataset_downloads) AS total_dataset_downloads
      FROM TotalDownloadsMonthYear
      WHERE year_id BETWEEN ? AND ? AND dataset_id = ?
      GROUP BY year_id, month_id`;

    execSql(QUERY_DOWNLOAD_DETAILS, [startYear, currentYear, datasetID])
      .then((sqlres) => {
        // Calculate sum of all years' data
        const totalDownloadsAllYears = sqlres.reduce((total, item) => total + parseInt(item.total_dataset_downloads), 0);
        const totalFileDownloadsAllYears = sqlres.reduce((total, item) => total + parseInt(item.total_file_downloads), 0);
        // Additional API to get total users, organizations, and countries
        const QUERY_TOTAL_USERS_ORGS_COUNTRIES = `
          SELECT SUM(total_users) AS total_users_all_years,
                 SUM(total_organizations) AS total_organizations_all_years,
                 SUM(total_countries) AS total_countries_all_years
          FROM TotalDownloadsMonthYear
          WHERE year_id BETWEEN ? AND ? AND dataset_id = ?`;

        execSql(QUERY_TOTAL_USERS_ORGS_COUNTRIES, [startYear, currentYear, datasetID])
          .then((usersOrgsCountriesRes) => {
            const {
              total_users_all_years,
              total_organizations_all_years,
              total_countries_all_years,
            } = usersOrgsCountriesRes[0];

            res.send({
              error: false,
              data: sqlres,
              total_dataset_downloads_all_years: totalDownloadsAllYears,
              total_file_downloads_all_years: totalFileDownloadsAllYears,
              total_users_all_years,
              total_organizations_all_years,
              total_countries_all_years,
            });
          })
          .catch((err) => {
            console.log(err.code);
            res.status(400).json({
              error: true,
              message: "SQL Error",
              data: err,
            });
          });
      })
      .catch((err) => {
        console.log(err.code);
        res.status(400).json({
          error: true,
          message: "SQL Error",
          data: err,
        });
      });
  } else {
    res.status(401).json({ error: true, message: "Dataset not available" });
  }
});


// API endpoint to get total downloads by day
router.get("/api/get-total-downloads-by-day", (req, res) => {
  console.log("Total Downloads By Day")
  //const { datasetID = "453982e4-3ff8-4785-8d49-f887c8f4b48a", yearID = 2018, monthID = 9 } = req.query;
  const { yearID, monthID, datasetID } = req.query;
  if (datasetID != null) {
    const QUERY_DOWNLOAD_DETAILS = `
      SELECT year_id, month_id, day_id, total_dataset_downloads, total_file_downloads
      FROM TotalDownloadsByDay
      WHERE year_id = ? AND month_id = ? AND dataset_id = ?`;

    const QUERY_TOTAL_DOWNLOADS_BY_MONTH = `
      SELECT year_id, month_id, SUM(total_dataset_downloads) AS total_dataset_downloads, 
        SUM(total_file_downloads) AS total_file_downloads
      FROM TotalDownloadsByDay
      WHERE year_id = ? AND month_id = ? AND dataset_id = ?
      GROUP BY year_id, month_id`;

    Promise.all([
      execSql(QUERY_DOWNLOAD_DETAILS, [yearID, monthID, datasetID]),
      execSql(QUERY_TOTAL_DOWNLOADS_BY_MONTH, [yearID, monthID, datasetID]),
    ])
      .then(([results, totalDownloadsByMonth]) => {
        const response = {
          error: false,
          data: results,
          totalDownloadsByMonth: totalDownloadsByMonth[0],
        };
        res.json(response);
      })
      .catch((error) => {
        console.error("Error executing query:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
      });
  } else {
    res.status(401).json({ error: true, message: "Dataset not available" });
  }
});

// API endpoint to get total downloads by Country, Year, and Month
router.get("/api/get-total-downloads-by-country", (req, res) => {
  const { datasetID, yearID, monthID } = req.query;
  if (datasetID && yearID && monthID) {
    const QUERY_TOTAL_DOWNLOADS_BY_COUNTRY = `
      SELECT month_id, year_id, total_dataset_downloads, total_file_downloads, country_name
      FROM TotalCountryMonthYear
      WHERE dataset_id = ? AND year_id = ? AND month_id = ?`;

    execSql(QUERY_TOTAL_DOWNLOADS_BY_COUNTRY, [datasetID, yearID, monthID])
      .then((results) => {
        const totalDownloadsByCountry = results.map(
          ({
            month_id,
            year_id,
            total_dataset_downloads,
            total_file_downloads,
            country_name,
          }) => ({
            month_id,
            year_id,
            total_dataset_downloads,
            total_file_downloads,
            country_name,
          })
        );

        const QUERY_TOTAL_DOWNLOADS_BY_YEAR = `
          SELECT year_id, SUM(total_dataset_downloads) AS total_dataset_downloads, SUM(total_file_downloads) AS total_file_downloads
          FROM TotalCountryMonthYear
          WHERE dataset_id = ? AND year_id = ?
          GROUP BY year_id`;

        execSql(QUERY_TOTAL_DOWNLOADS_BY_YEAR, [datasetID, yearID])
          .then((yearResult) => {
            const { year_id, total_dataset_downloads, total_file_downloads } =
              yearResult[0];

            const QUERY_TOTAL_DOWNLOADS_BY_MONTH = `
              SELECT month_id, SUM(total_dataset_downloads) AS total_dataset_downloads, SUM(total_file_downloads) AS total_file_downloads
              FROM TotalCountryMonthYear
              WHERE dataset_id = ? AND year_id = ? AND month_id = ?`;

            execSql(QUERY_TOTAL_DOWNLOADS_BY_MONTH, [
              datasetID,
              yearID,
              monthID,
            ])
              .then((monthResult) => {
                const {
                  month_id,
                  total_dataset_downloads,
                  total_file_downloads,
                } = monthResult[0];

                const QUERY_TOTAL_COUNTRIES_MONTH = `
                  SELECT COUNT(DISTINCT country_name) AS total_countries_month
                  FROM TotalCountryMonthYear
                  WHERE dataset_id = ? AND year_id = ? AND month_id = ?`;

                execSql(QUERY_TOTAL_COUNTRIES_MONTH, [
                  datasetID,
                  yearID,
                  monthID,
                ])
                  .then((countriesMonthResult) => {
                    const { total_countries_month } = countriesMonthResult[0];

                    const QUERY_TOTAL_COUNTRIES_YEAR = `
                      SELECT COUNT(DISTINCT country_name) AS total_countries_year
                      FROM TotalCountryMonthYear
                      WHERE dataset_id = ? AND year_id = ?`;

                    execSql(QUERY_TOTAL_COUNTRIES_YEAR, [datasetID, yearID])
                      .then((countriesYearResult) => {
                        const { total_countries_year } = countriesYearResult[0];

                        res.json({
                          error: false,
                          data: {
                            totalDownloadsByCountry,
                            totalDownloadsByYear: {
                              year_id,
                              total_dataset_downloads,
                              total_file_downloads,
                              total_countries_year,
                            },
                            totalDownloadsByMonth: {
                              year_id,
                              month_id,
                              total_dataset_downloads,
                              total_file_downloads,
                              total_countries_month,
                            },
                          },
                        });
                      })
                      .catch((error) => {
                        console.error("Error executing query:", error);
                        res
                          .status(500)
                          .json({
                            error: true,
                            message: "Internal server error",
                          });
                      });
                  })
                  .catch((error) => {
                    console.error("Error executing query:", error);
                    res
                      .status(500)
                      .json({ error: true, message: "Internal server error" });
                  });
              })
              .catch((error) => {
                console.error("Error executing query:", error);
                res
                  .status(500)
                  .json({ error: true, message: "Internal server error" });
              });
          })
          .catch((error) => {
            console.error("Error executing query:", error);
            res
              .status(500)
              .json({ error: true, message: "Internal server error" });
          });
      })
      .catch((error) => {
        console.error("Error executing query:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
      });
  } else {
    res.status(400).json({ error: true, message: "Invalid parameters" });
  }
});

// Get Unique years only
router.get("/api/get-unique-years", (req, res) => {
  const { datasetID } = req.query;
  if (!datasetID) {
    return res
      .status(400)
      .json({ error: true, message: "Missing datasetID parameter" });
  }

  const query = `
    SELECT DISTINCT year_id
    FROM TotalDownloadsMonthYear
    WHERE dataset_id = ?
    ORDER BY year_id ASC`;

  execSql(query, [datasetID])
    .then((results) => {
      const uniqueYears = results.map(({ year_id }) => year_id);
      res.json({ error: false, data: uniqueYears });
    })
    .catch((error) => {
      console.error("Error executing query:", error);
      res.status(500).json({ error: true, message: "Internal server error" });
    });
});

// Get Registered organization user by month year
router.get("/api/get-users-by-organization-month-year", async (req, res) => {
  const { yearID, monthID, datasetID } = req.query;
  const QUERY_REGISTERED_USERS = `
    SELECT year_id, month_id, total_registered_user, user_organization_name
    FROM TotalRegisteredUserByOrganizationYearMonth
    WHERE month_id = ? AND year_id = ? AND dataset_id = ?`;

  const QUERY_TOTAL_REGISTERED_USERS_IN_MONTH = `
    SELECT SUM(total_registered_user) AS total_registered_userSum, COUNT(DISTINCT user_organization_name) AS total_organizationCount
    FROM TotalRegisteredUserByOrganizationYearMonth
    WHERE month_id = ? AND year_id = ? AND dataset_id = ?`;

  const QUERY_TOTAL_REGISTERED_USERS_IN_YEAR = `
    SELECT year_id, SUM(total_registered_user) AS total_registered_user, COUNT(DISTINCT user_organization_name) AS total_organization
    FROM TotalRegisteredUserByOrganizationYearMonth
    WHERE year_id = ? AND dataset_id = ?
    GROUP BY year_id`;

  try {
    const [
      registeredUsers,
      totalRegisteredUsersInMonth,
      totalRegisteredUsersInYear,
    ] = await Promise.all([
      execSql(QUERY_REGISTERED_USERS, [monthID, yearID, datasetID]),
      execSql(QUERY_TOTAL_REGISTERED_USERS_IN_MONTH, [
        monthID,
        yearID,
        datasetID,
      ]),
      execSql(QUERY_TOTAL_REGISTERED_USERS_IN_YEAR, [yearID, datasetID]),
    ]);

    const response = {
      error: false,
      data: registeredUsers,
      totalRegisteredUserInMonth: {
        year_id: yearID,
        month_id: monthID,
        total_registered_userSum:
          totalRegisteredUsersInMonth[0].total_registered_userSum.toString(),
        total_organizationCount:
          totalRegisteredUsersInMonth[0].total_organizationCount,
      },
      totalRegisteredUserInYear: totalRegisteredUsersInYear[0],
    };

    res.json(response);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;