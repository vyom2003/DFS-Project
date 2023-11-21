const axios = require('axios');
const geoip = require('geoip-lite');
const countryList = require('country-list');
const { lookup } = require("geoip-lite");
const { execSql } = require("../../db");

function getPublicIp(req) {
  return new Promise((resolve, reject) => {
    const rawIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const privateIp = rawIp.replace(/^::ffff:/, "");
    axios
      .get(`http://icanhazip.com`, {
        headers: { "X-Forwarded-For": privateIp },
      })
      .then((response) => resolve(response.data.trim()))
      .catch((error) =>
        reject(new Error("Error fetching public IP: " + error))
      );
  });
}

function getUserCountry(ip) {
  const lookup = geoip.lookup(ip);
  const countryCode = lookup ? lookup.country : null;
  if (countryCode) {
    const countryName = countryList.getName(countryCode);
    return countryName || "Unknown Country";
  } else {
    return "Unknown Country";
  }
}

function downloadLogHandler(datasetid, filename, req,user) {
  const QUERY_GET_DATASET_DETAILS_FROM_ID = `SELECT dataset_name, domain FROM Dataset WHERE dataset_id="${datasetid}"`;
  const datasetPromise = execSql(QUERY_GET_DATASET_DETAILS_FROM_ID);
  const publicIpPromise = getPublicIp(req);

  // Return a new Promise
  return new Promise((resolve, reject) => {
    Promise.all([datasetPromise, publicIpPromise])
      .then(values => {
        const [datasetResult, publicIp] = values;
        const dataset = datasetResult[0];
        const userCountry = getUserCountry(publicIp);
        const QUERY_LOG_README = `SELECT * FROM Files WHERE database_id="${datasetid}" AND upfilenameMD="${filename}"`;
        const logDetails = {
          dataset_id: datasetid,
          dataset_name: dataset?.dataset_name || "Unknown Dataset",
          dataset_domain_name: dataset?.domain || "Unknown Domain",
          download_time_stamp: new Date(),
          file_downloads: 1,
          user_first_name: user?.first_name || "Unknown",
          user_email: user?.user_email || "unknown@example.com",
          user_country_name: userCountry,
          user_organization_name: user?.institution || "Unknown Institution",
          user_ip_address: publicIp,
        };
        const QUERY_LOG_DOWNLOAD = `
          INSERT INTO Downloads (
            dataset_id, dataset_name, dataset_domain_name,
            download_time_stamp, file_downloads,
            user_first_name, user_email, user_country_name,
            user_organization_name, user_ip_address
          )
          VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`;
  
        execSql(QUERY_LOG_README).then((sqlres) => {
          if (sqlres.length === 0 && datasetid !== undefined) {
            execSql(QUERY_LOG_DOWNLOAD, [
              logDetails.dataset_id,
              logDetails.dataset_name,
              logDetails.dataset_domain_name,
              logDetails.file_downloads,
              logDetails.user_first_name,
              logDetails.user_email,
              logDetails.user_country_name,
              logDetails.user_organization_name,
              logDetails.user_ip_address,
            ]).then(res => resolve(res))
            .catch(err => reject(err));
          }
        }).then(res => resolve(res))
        .catch(err => reject(err));
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = { 
  getPublicIp, 
  getUserCountry,
  downloadLogHandler 
};
