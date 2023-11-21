const express = require("express");
const router = express.Router();
const { execSql } = require("../../db");
const fs = require("fs");
const { detokn } = require("./utils");
const { lookup } = require("geoip-lite");

let tokens = {};
let logoutHandlerId;
if (fs.existsSync("./tokens.json"))
  tokens = JSON.parse(fs.readFileSync("./tokens.json"));
else fs.writeFileSync("./tokens.json", JSON.stringify(tokens));

function create_token() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : r & (0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function getUser(email, password) {
  return new Promise((resolve, reject) => {
    const query = `SELECT first_name, last_name, user_email, institution, designation, user_role FROM DfsUser WHERE user_email="${email}" AND user_password="${password}"`;
    execSql(query)
      .then((res) => {
        if (res.length == 0) {
          reject({ error: "username and password do not match" });
        } else {
          execSql(query).then((res) => {
            if (res.length == 0) {
              reject({ error: "incorrect password" });
            } else {
              resolve(res[0]);
            }
          });
          // resolve(res[0]);
        }
      })
      .catch((err) => {
        // console.log("error = ",err);
        reject({ error: "missmatched username or password" });
      });
  });
}

router.get("/api/get-user-details", (req, res) => {
  const { email } = req.query;
  // console.log(email);
  // first_name":"Amey","last_name":"Kudari","user_password":"amey","user_email":"amey.kudari@students.iiit.ac.in","institution":"IIIT-H","designation":"software engineer","user_role":"admin"}
  const GET_USER_DETAILS_QUERY = `SELECT first_name, last_name, user_email, institution, designation, user_role FROM DfsUser WHERE user_email="${email}"`;
  // console.log(GET_USER_DETAILS_QUERY);
  execSql(GET_USER_DETAILS_QUERY)
    .then((sres) => {
      res.json(sres);
    })
    .catch((err) => {
      res
        .status(404)
        .json({ error: true, message: "user not found", data: err });
    });
});

router.get("/api/detokn", (req, res) => {
  const { token } = req.query;
  const user = detokn(token);
  if (user) {
    res.status(200).json({
      data: user,
      error: false,
    });
  } else {
    res.status(404).json({
      data: null,
      error: true,
    });
  }
});

router.post("/api/login", (req, res) => {
  getUser(req.body.email, req.body.password)
    .then((user) => {
      const token = create_token();
      tokens[token] = user;

      // console.log("WRITING TOKENS");
      fs.writeFileSync("./tokens.json", JSON.stringify(tokens));
      logoutHandlerId = setTimeout(() => {
        // replace with auth function
        delete tokens[token];
        fs.writeFileSync("./tokens.json", JSON.stringify(tokens));
      }, 1000 * 60 * 60); // 1hr
      res.status(200).json({
        error: "false",
        data: {
          user,
          token,
          validTill: new Date(Date.now() + 1000 * 60 * 60), // 1 hr
        },
        message: "Token generated successfully",
      });
    })
    .catch((err) => {
      res.status(401).json({
        error: "true",
        status: "Login error",
        data: err,
      });
    });
});

router.post("/api/detoken", (req, res) => {
  getUser(req.body.email, req.body.password)
    .then((user) => {
      const token = create_token();
      tokens[token] = user;
      setTimeout(() => delete tokens[token], 1000 * 60 * 5);
      res.status(200).json({
        error: "false",
        data: {
          user,
          token,
        },
        message: "Token generated successfully",
      });
    })
    .catch((err) => {
      res.status(401).json({
        error: "true",
        status: "Login error",
        data: err,
      });
    });
});

router.post("/api/register", (req, res) => {
  const {
    firstname,
    lastname,
    password,
    email,
    institution,
    designation,
    role,
  } = req.body;
  // console.log(
  //   firstname,
  //   lastname,
  //   password,
  //   email,
  //   institution,
  //   designation,
  //   role
  // );


  if (
    firstname &&
    lastname &&
    password &&
    email &&
    institution &&
    designation &&
    role
  ) {
    const query = `SELECT * FROM DfsUser WHERE user_email="${email}"`;
    execSql(query)
      .then((sres) => {
        if (sres.length == 0) {
          const QUERY_REGISTER_USER = `INSERT INTO DfsUser VALUES ("${firstname}","${lastname}","${password}","${email}","${institution}","${designation}","${role}, ${String(
            Date.now()
          )}, ${'not available'}, ${'not available'}")`;
          execSql(QUERY_REGISTER_USER)
            .then((insres) => {
              res
                .status(200)
                .json({ error: false, message: "User successfully added" });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ error: true, message: "Internal Server Error" });
            });
        } else {
          res.status(409).json({ error: true, message: "User already exists" });
        }
      })
      .catch((err) => {
        // console.log("error on /register: ", err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
      });
  } else {
    res.status(400).json({ error: true, message: "Invalid attributes" });
  }
});

router.post("/api/user-registration-stats", (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization.split("Bearer ")[1]);
    if (user?.user_role && startTimeStamp && endTimeStamp) {
      const { institution, timezone } = req.query;
      const QUERY_DOWNLOAD_DETAILS_BETWEEN =
        `SELECT COUNT(*) FROM DfsUser WHERE registry_time BETWEEN ${startTimeStamp} AND ${endTimeStamp}` +
        institution
          ? ` AND file_name=${institution}`
          : "" + timezone
          ? ` AND timezone=${timezone}`
          : "";
      execSql(QUERY_DOWNLOAD_DETAILS_BETWEEN)
        .then((sqlres) => {
          res.json({
            error: false,
            data: sqlres,
          });
        })
        .catch((err) => {
          // console.log(err.code);
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err,
          });
        });
    } else res.status(401).json({ error: true, message: "Invalid token" });
  } else {
    res.status(401).json({ error: true, message: "Invalid token" });
  }
});

router.post("/api/user-registration-stats-grouped", (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization.split("Bearer ")[1]);
    if (user?.user_role && startTimeStamp && endTimeStamp) {
      const { institution, timezone } = req.query;
      const QUERY_DOWNLOAD_DETAILS_BETWEEN =
        `SELECT COUNT(*), timezone FROM DfsUser WHERE registry_time BETWEEN ${startTimeStamp} AND ${endTimeStamp}` +
        institution
          ? ` AND file_name=${institution}`
          : "" + " GROUP BY timezone";
      execSql(QUERY_DOWNLOAD_DETAILS_BETWEEN)
        .then((sqlres) => {
          res.json({
            error: false,
            data: sqlres,
          });
        })
        .catch((err) => {
          // console.log(err.code);
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err,
          });
        });
    } else res.status(401).json({ error: true, message: "Invalid token" });
  } else {
    res.status(401).json({ error: true, message: "Invalid token" });
  }
});

router.post("/api/logout", (req, res) => {
  const { token } = req.query;
  fs.writeFileSync("./tokens.json", JSON.stringify(_.omit(tokens, token)));
  res.json("Logged out successfully");
  clearTimeout(logoutHandlerId);
});

module.exports = router;
