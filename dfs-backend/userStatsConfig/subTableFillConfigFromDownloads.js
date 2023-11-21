const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: "localhost",
  user: "dfs",
  password: "password",
  database: "dfsdata",
});
const QUERY_DOWNLOAD = `SELECT * FROM TotalDownloads`;

async function checkIfDownloadsExist(conn) {
  return new Promise((resolve, reject) => {
    conn.query(QUERY_DOWNLOAD, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.length > 0);
      }
    });
  });
}

conn.connect(async (err) => {
  if (err) throw err;
  console.log("Connected to MySQL database!");
  const create_table_TotalDownloads = `
    CREATE TABLE IF NOT EXISTS TotalDownloads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      dataset_id varchar(255),
      dataset_name varchar(255),
      dataset_domain_name varchar(255),
      total_dataset_downloads INT,
      total_file_downloads INT,
      total_users INT,
      total_organizations INT,
      total_countries INT,
      UNIQUE KEY unique_dataset (dataset_id, dataset_domain_name)
    )
  `;

  const create_table_TotalDownloads_month_year = `
    CREATE TABLE IF NOT EXISTS TotalDownloadsMonthYear (
      dataset_id varchar(255),
      dataset_domain_name varchar(255),
      month_id  INT,
      year_id  INT,
      total_dataset_downloads INT,
      total_file_downloads INT,
      total_users INT,
      total_organizations INT,
      total_countries INT,
      PRIMARY KEY (dataset_id, dataset_domain_name, year_id, month_id)
    )
  `;

  const create_table_TotalDownloads_by_day = `
    CREATE TABLE IF NOT EXISTS TotalDownloadsByDay (
      dataset_id varchar(255),
      dataset_domain_name varchar(255),
      day_id INT,
      month_id INT,
      year_id INT,
      total_dataset_downloads INT,
      total_file_downloads INT,
      PRIMARY KEY (day_id, month_id, year_id, dataset_id)
    )
  `;

  const create_total_country_month_year = `
    CREATE TABLE IF NOT EXISTS TotalCountryMonthYear (
      dataset_id varchar(255),
      dataset_domain_name varchar(255),
      month_id INT,
      year_id INT,
      country_name varchar(255),
      total_dataset_downloads INT,
      total_file_downloads INT,
      PRIMARY KEY (dataset_id, dataset_domain_name, year_id, month_id, country_name)
    )
  `;

  const create_table_total_registered_user_by_organization_year_month = `
    CREATE TABLE IF NOT EXISTS TotalRegisteredUserByOrganizationYearMonth (
      dataset_id varchar(255),
      dataset_name varchar(255),
      dataset_domain_name varchar(255),
      month_id INT,
      year_id INT,
      total_registered_user INT,
      user_organization_name varchar(255),
      PRIMARY KEY (dataset_id, dataset_domain_name, year_id, month_id, user_organization_name)
    )
  `;

  conn.query(create_table_TotalDownloads, (err) => {
    if (err) throw err;
    console.log("TotalDownloads table created or already exists.");
  });

  conn.query(create_table_TotalDownloads_month_year, (err) => {
    if (err) throw err;
    console.log("TotalDownloadsMonthYear table created or already exists.");
  });

  conn.query(create_table_TotalDownloads_by_day, (err) => {
    if (err) throw err;
    console.log("TotalDownloadsByDay table created or already exists.");
  });

  conn.query(create_total_country_month_year, (err) => {
    if (err) throw err;
    console.log("TotalCountryMonthYear table created or already exists.");
  });

  conn.query(create_table_total_registered_user_by_organization_year_month, (err) => {
    if (err) throw err;
    console.log("TotalRegisteredUserByOrganizationYearMonth table created or already exists.");
  });
  const read_from_new_entries = await checkIfDownloadsExist(conn);
  console.log("Read from MySQL database : ", read_from_new_entries);
  // const QUERY_DOWNLOAD = `SELECT * FROM totaldownloads`;
  // const read_from_new_entries = conn.query(QUERY_DOWNLOAD, (err, res) => {
  //   if(res.length > 0) 
  //     return false;
  //   else true;
  // });
  //const read_from_new_entries = true; // Set to true to execute the first part, false to execute the second part

  

  const latest_timestamp = read_from_new_entries
    ? null
    : new Date(new Date() - 24 * 60 * 60 * 1000) // Get the timestamp of the previous day
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

  if (!read_from_new_entries) {
    const populate_TotalDownloads = `
      INSERT INTO TotalDownloads (dataset_id, dataset_domain_name, dataset_name, total_dataset_downloads, total_file_downloads, total_users, total_organizations, total_countries)
      SELECT M.dataset_id, M.dataset_domain_name, M.dataset_name, 
             COUNT(DISTINCT M.download_id) as total_dataset_downloads,
             SUM(M.file_downloads) as total_file_downloads,
             COUNT(DISTINCT M.user_email) as total_users,
             COUNT(DISTINCT M.user_organization_name) as total_organizations,
             COUNT(DISTINCT M.user_country_name) as total_countries
      FROM Downloads AS M
      GROUP BY M.dataset_id, M.dataset_domain_name, M.dataset_name
      ON DUPLICATE KEY UPDATE
      total_dataset_downloads = VALUES(total_dataset_downloads),
      total_file_downloads = VALUES(total_file_downloads),
      total_users = VALUES(total_users),
      total_organizations = VALUES(total_organizations),
      total_countries = VALUES(total_countries)
    `;

    const populate_TotalDownloads_month_year = `
    INSERT INTO TotalDownloadsMonthYear (dataset_id, dataset_domain_name, month_id, year_id, total_dataset_downloads, total_file_downloads, total_users, total_organizations, total_countries)
    SELECT M.dataset_id, M.dataset_domain_name, MONTH(M.download_time_stamp) AS month_id, YEAR(M.download_time_stamp) AS year_id, COUNT(DISTINCT M.download_id), SUM(M.file_downloads), COUNT(DISTINCT M.user_email), COUNT(DISTINCT M.user_organization_name), COUNT(DISTINCT M.user_country_name)
    FROM Downloads AS M
    GROUP BY M.dataset_id, M.dataset_domain_name, MONTH(M.download_time_stamp), YEAR(M.download_time_stamp)
    ON DUPLICATE KEY UPDATE
      total_dataset_downloads = VALUES(total_dataset_downloads),
      total_file_downloads = VALUES(total_file_downloads),
      total_users = VALUES(total_users),
      total_organizations = VALUES(total_organizations),
      total_countries = VALUES(total_countries)
  `;
  

    const populate_TotalDownloads_by_day = `
      INSERT INTO TotalDownloadsByDay (dataset_id, dataset_domain_name, day_id, month_id, year_id, total_dataset_downloads, total_file_downloads)
      SELECT M.dataset_id, M.dataset_domain_name, DAY(M.download_time_stamp), MONTH(M.download_time_stamp), YEAR(M.download_time_stamp), COUNT(DISTINCT M.download_id), SUM(M.file_downloads)
      FROM Downloads AS M
      GROUP BY M.dataset_id, M.dataset_domain_name, DAY(M.download_time_stamp), MONTH(M.download_time_stamp), YEAR(M.download_time_stamp)
      ON DUPLICATE KEY UPDATE
      total_dataset_downloads = VALUES(total_dataset_downloads),
      total_file_downloads = VALUES(total_file_downloads)
    `;

    const populate_total_country_month_year = `
      INSERT INTO TotalCountryMonthYear (dataset_id, dataset_domain_name, month_id, year_id, country_name, total_dataset_downloads, total_file_downloads)
      SELECT M.dataset_id, M.dataset_domain_name, MONTH(M.download_time_stamp) AS month_id, YEAR(M.download_time_stamp) AS year_id, M.user_country_name, COUNT(DISTINCT M.download_id), SUM(M.file_downloads)
      FROM Downloads AS M
      GROUP BY M.dataset_id, M.dataset_domain_name, YEAR(M.download_time_stamp), MONTH(M.download_time_stamp), M.user_country_name
      ON DUPLICATE KEY UPDATE
      total_dataset_downloads = VALUES(total_dataset_downloads),
      total_file_downloads = VALUES(total_file_downloads)
    `;

    const populate_total_registered_user_by_domain_month = `
      INSERT INTO TotalRegisteredUserByOrganizationYearMonth (dataset_id, dataset_name, dataset_domain_name, year_id, month_id, total_registered_user, user_organization_name)
      SELECT M.dataset_id, M.dataset_name, M.dataset_domain_name, YEAR(M.download_time_stamp) AS year_id, MONTH(M.download_time_stamp) AS month_id, COUNT(DISTINCT M.user_email) AS total_registered_user, M.user_organization_name
      FROM Downloads AS M
      GROUP BY M.dataset_id, M.dataset_name, M.dataset_domain_name, YEAR(M.download_time_stamp), MONTH(M.download_time_stamp), M.user_organization_name
      ON DUPLICATE KEY UPDATE
      total_registered_user = VALUES(total_registered_user)
    `;

    conn.query(populate_TotalDownloads, (err) => {
      if (err) throw err;
      console.log("TotalDownloads table populated or updated.");
    });

    conn.query(populate_TotalDownloads_month_year, (err) => {
      if (err) throw err;
      console.log("TotalDownloadsMonthYear table populated or updated.");
    });

    conn.query(populate_TotalDownloads_by_day, (err) => {
      if (err) throw err;
      console.log("TotalDownloadsByDay table populated or updated.");
    });

    conn.query(populate_total_country_month_year, (err) => {
      if (err) throw err;
      console.log("TotalCountryMonthYear table populated or updated.");
    });

    conn.query(populate_total_registered_user_by_domain_month, (err) => {
      if (err) throw err;
      console.log("TotalRegisteredUserByOrganizationYearMonth table populated or updated.");
    });

  } else {
    const update_TotalDownloads = `
      INSERT INTO TotalDownloads (dataset_id, dataset_domain_name, dataset_name, total_dataset_downloads, total_file_downloads, total_users, total_organizations, total_countries)
      SELECT M.dataset_id, M.dataset_domain_name, M.dataset_name, COUNT(DISTINCT M.download_id), SUM(M.file_downloads), COUNT(DISTINCT M.user_email), COUNT(DISTINCT M.user_organization_name), COUNT(DISTINCT M.user_country_name)
      FROM Downloads AS M
      WHERE DATE(M.download_time_stamp) = CURDATE() - INTERVAL 1 DAY
      GROUP BY M.dataset_id, M.dataset_domain_name, M.dataset_name
      ON DUPLICATE KEY UPDATE
      total_dataset_downloads = total_dataset_downloads + VALUES(total_dataset_downloads),
      total_file_downloads = total_file_downloads + VALUES(total_file_downloads),
      total_users = total_users + VALUES(total_users),
      total_organizations = total_organizations + VALUES(total_organizations),
      total_countries = total_countries + VALUES(total_countries)
    `;

    const update_TotalDownloads_month_year = `
      INSERT INTO TotalDownloadsMonthYear (dataset_id, dataset_domain_name, month_id, year_id, total_dataset_downloads, total_file_downloads, total_users, total_organizations, total_countries)
      SELECT M.dataset_id, M.dataset_domain_name, MONTH(M.download_time_stamp) AS month_id, YEAR(M.download_time_stamp) AS year_id, COUNT(DISTINCT M.download_id), SUM(M.file_downloads), COUNT(DISTINCT M.user_email), COUNT(DISTINCT M.user_organization_name), COUNT(DISTINCT M.user_country_name)
      FROM Downloads AS M
      WHERE DATE(M.download_time_stamp) = CURDATE() - INTERVAL 1 DAY
      GROUP BY M.dataset_id, M.dataset_domain_name, MONTH(M.download_time_stamp), YEAR(M.download_time_stamp)
      ON DUPLICATE KEY UPDATE
      total_dataset_downloads = total_dataset_downloads + VALUES(total_dataset_downloads),
      total_file_downloads = total_file_downloads + VALUES(total_file_downloads),
      total_users = total_users + VALUES(total_users),
      total_organizations = total_organizations + VALUES(total_organizations),
      total_countries = total_countries + VALUES(total_countries)
    `;

    const update_TotalDownloads_by_day = `
      INSERT INTO TotalDownloadsByDay (dataset_id, dataset_domain_name, day_id, month_id, year_id, total_dataset_downloads, total_file_downloads)
      SELECT M.dataset_id, M.dataset_domain_name, DAY(M.download_time_stamp), MONTH(M.download_time_stamp), YEAR(M.download_time_stamp), COUNT(DISTINCT M.download_id), SUM(M.file_downloads)
      FROM Downloads AS M
      WHERE DATE(M.download_time_stamp) = CURDATE() - INTERVAL 1 DAY
      GROUP BY M.dataset_id, M.dataset_domain_name, DAY(M.download_time_stamp), MONTH(M.download_time_stamp), YEAR(M.download_time_stamp)
      ON DUPLICATE KEY UPDATE
      total_dataset_downloads = total_dataset_downloads + VALUES(total_dataset_downloads),
      total_file_downloads = total_file_downloads + VALUES(total_file_downloads)
    `;

    const update_total_country_month_year = `
      INSERT INTO TotalCountryMonthYear (dataset_id, dataset_domain_name, month_id, year_id, country_name, total_dataset_downloads, total_file_downloads)
      SELECT M.dataset_id, M.dataset_domain_name, MONTH(M.download_time_stamp) AS month_id, YEAR(M.download_time_stamp) AS year_id, M.user_country_name, COUNT(DISTINCT M.download_id), SUM(M.file_downloads)
      FROM Downloads AS M
      WHERE DATE(M.download_time_stamp) = CURDATE() - INTERVAL 1 DAY
      GROUP BY M.dataset_id, M.dataset_domain_name, YEAR(M.download_time_stamp), MONTH(M.download_time_stamp), M.user_country_name
      ON DUPLICATE KEY UPDATE
      total_dataset_downloads = total_dataset_downloads + VALUES(total_dataset_downloads),
      total_file_downloads = total_file_downloads + VALUES(total_file_downloads)
    `;

    const update_total_registered_user_by_domain_month = `
      INSERT INTO TotalRegisteredUserByOrganizationYearMonth (dataset_id, dataset_name, dataset_domain_name, year_id, month_id, total_registered_user, user_organization_name)
      SELECT M.dataset_id, M.dataset_name, M.dataset_domain_name, YEAR(M.download_time_stamp) AS year_id, MONTH(M.download_time_stamp) AS month_id, COUNT(DISTINCT M.user_email) AS total_registered_user, M.user_organization_name
      FROM Downloads AS M
      WHERE DATE(M.download_time_stamp) = CURDATE() - INTERVAL 1 DAY
      GROUP BY M.dataset_id, M.dataset_name, M.dataset_domain_name, YEAR(M.download_time_stamp), MONTH(M.download_time_stamp), M.user_organization_name
      ON DUPLICATE KEY UPDATE
      total_registered_user = total_registered_user + VALUES(total_registered_user)
    `;

    conn.query(update_TotalDownloads_by_day, (err) => {
      if (err) throw err;
      console.log("TotalDownloadsByDay table updated.");
    });

    conn.query(update_total_country_month_year, (err) => {
      if (err) throw err;
      console.log("TotalCountryMonthYear table updated.");
    });

    conn.query(update_total_registered_user_by_domain_month, (err) => {
      if (err) throw err;
      console.log("TotalRegisteredUserByOrganizationYearMonth table updated.");
    });

    conn.query(update_TotalDownloads_month_year, (err) => {
      if (err) throw err;
      console.log("TotalDownloadsMonthYear table updated.");
    });

    conn.query(update_TotalDownloads, (err) => {
      if (err) throw err;
      console.log("TotalDownloads table updated.");
    });
  }

  conn.end((err) => {
    if (err) throw err;
    console.log("Disconnected from MySQL database!");
  });
});