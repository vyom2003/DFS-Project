const { query } = require("express");
const express = require("express");
const router = express.Router();
const { execSql } = require("../../db");
const { detokn } = require("../auth/utils");
const { moveFileToMinio } = require("../../helpers/minioFileUpload");
const { getPublicIp, getUserCountry, downloadLogHandler } = require('./utils');

// corresponding database structure
// upfilename varchar(255),
// upfilenameMD varchar(255),
// filetype varchar(255),
// database_id varchar(255),
// databaseVersion_id varchar(255),
// comments text,
// version_name varchar(255),
// reference varchar(255),
// created_date varchar(255),
// last_edit varchar(255),
// publication_names text,
// publication_links text,
// verification varchar(255),
// public varchar(255),
// author_id varchar(255),
// PRIMARY KEY (upfilename)

router.post("/api/sqlfile", (req, res) => {
  const requser = detokn(req.headers.authorization.split("Bearer ")[1]);
  const now = new Date() - 0 + "";
  const {
    filetype,
    filesize,
    upfilename,
    upfilenameMD,
    databaseId,
    databaseVersionId,
    comments,
    version_name,
    reference,
    created_date,
    publication_names,
    publication_links,
    verification,
    public,
    additional
  } = req.body;
  if (
    filetype &&
    filesize &&
    upfilename &&
    upfilenameMD &&
    databaseId &&
    databaseVersionId &&
    comments &&
    version_name &&
    reference &&
    created_date &&
    public &&
    requser &&
    (additional || additional === '')
  ) {
    const QUERY_ADD_FILE = `INSERT INTO Files VALUES ( 
     '${upfilename}', 
     '${upfilenameMD}' ,
     '${filetype}' ,
      ${filesize},
     '${databaseId}' ,
     '${databaseVersionId}' ,
     '${comments.replaceAll("'", "''")}' ,
     '${version_name}' ,
     '${reference}' ,
     '${created_date}' ,
     '${now}' ,
     '${publication_names}' ,
     '${publication_links}' ,
     'verified' ,
     '${public}',
     '${requser.user_email}',
     '${additional}',
     0
    )`;
    execSql(QUERY_ADD_FILE)
      .then((sqlres) => {
        res.json({
          error: false,
          data: sqlres,
        });
      })
      .catch((err) => {
        if (err.code == "ER_DUP_ENTRY") {
          res.json({
            error: true,
            message: err.code,
          });
        } else {
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err,
          });
        }
      });
  } else {
    res.status(400).json({
      error: true,
      message: "Missing attributes",
    });
  }
});

router.post("/api/fileverify", function (req, res) {
  const user = detokn(req.headers.authorization.split("Bearer ")[1]);
  if (user.user_role === "admin") {
    const query = `UPDATE Files Set verification = 'verified' WHERE upfilename = '${
      req.body.upfilename.split(";")[0]
    }'`; // prevent sql injection
    execSql(query)
      .then((sqlres) => {
        moveFileToMinio(req.body.upfilename.split(";")[0])
          .then(() => {
            res.json({
              error: false,
              data: sqlres,
            });
          })
          .catch((err) => {
            res.status(400).json({
              error: false,
              message: "File already uploaded to minIO",
              data: err,
            });
          });
      })
      .catch((err) => {
        if (err.code == "ER_DUP_ENTRY") {
          res.json({
            error: true,
            message: err.code,
          });
        } else {
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err,
          });
        }
      });
  } else {
    res.status(401).json({
      error: true,
      message: "user is not admin",
    });
  }
});

router.post("/api/filereject", function (req, res) {
  const user = detokn(req.headers.authorization.split("Bearer ")[1]);
  if (user.user_role === "admin") {
    const query = `UPDATE Files Set verification = 'rejected' WHERE upfilename = '${
      req.body.upfilename.split(";")[0]
    }'`; // prevent sql injection
    execSql(query)
      .then((sqlres) => {
        res.json({
          error: false,
          data: sqlres,
        });
      })
      .catch((err) => {
        if (err.code == "ER_DUP_ENTRY") {
          res.json({
            error: true,
            message: err.code,
          });
        } else {
          res.status(400).json({
            error: true,
            message: "SQL Error",
            data: err,
          });
        }
      });
  } else {
    res.status(401).json({
      error: true,
      message: "user is not admin",
    });
  }
});

// Download
router.get("/api/download", function (req, res) {
  const { filename, datasetid, token } = req.query;
  const user = detokn(token);

  downloadLogHandler(datasetid, filename, req, user)
    .catch((error) => {
      // ISKO LOG KARNA HE
    })
    .finally(() => {
      const file = "uploads/" + filename;
      res.download(file);
    });
});

// Download latest
router.get("/api/download-latest", function (req, res) {
  const { upfilename, versionId, token } = req.query;
  const user = detokn(token);
  if (user) {
    const query =
      'SELECT * FROM Files WHERE upfilename="' +
      upfilename +
      '" AND databaseVersion_id="' +
      versionId +
      '"';
    execSql(query)
      .then((sres) => {
        if (sres.length === 0) {
          res.status(404).json({ error: false, message: "File not found" });
        } else {
          const file = "uploads/" + upfilename;
          res.download(file, upfilename, (err) => {
            if (err) {
              if (res.headersSent) {
              } else {
                res
                  .status(404)
                  .json({
                    error: false,
                    message: "Error! File not found in database",
                  });
              }
            }
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: false, message: "SQL ERROR" });
      });
  } else {
    res.status(401).json({ error: true, message: "INVALID REQUEST" });
  }
});

router.get("/api/download-req", function (req, res) {
  const { filename, datasetid, token } = req.query;
  const user = detokn(token);
  const query =
    'SELECT * FROM Files WHERE upfilename="' +
    filename +
    '" OR upfilenameMD="' +
    filename +
    '"';
  execSql(query)
    .then((sres) => {
      const file = "uploads/" + filename;
      res.download(file); // Set disposition and send it.
    })
    .catch((err) => {
      res.status(500).json({ error: false, message: "SQL ERROR" });
    });
});

router.get("/api/download-req-status", function (req, res) {
  const { upfilename, token } = req.query;
  const user = detokn(req.headers.authorization?.split("Bearer ")[1] ?? token);
  const VERSION_PUBLIC_CHECK_QUERY =
    'SELECT * FROM Files WHERE upfilename="' +
    upfilename +
    '" and public="public"';
  const FILE_REQUEST_QUERY =
    'SELECT * FROM Requests WHERE requester="' +
    user?.user_email +
    '" AND upfilename="' +
    upfilename +
    '"';
  const GROUP_PERMISSION_QUERY = `SELECT DatasetGroups.user_id, DatasetGroups.group_name FROM Requests JOIN DatasetGroups ON Requests.requester = DatasetGroups.group_id WHERE DatasetGroups.user_id="${user?.user_email}" AND Requests.upfilename="${upfilename}"`;
  execSql(VERSION_PUBLIC_CHECK_QUERY)
    .then((resp) => {
      if (resp.length > 0) {
        res.json(resp);
      } else {
        execSql(GROUP_PERMISSION_QUERY)
          .then((gsres) => {
            if (gsres.length > 0) {
              res.json(gsres);
            } else {
              execSql(FILE_REQUEST_QUERY).then((sres) => {
                res.json(sres); // TODO: FIX LATER.
              });
            }
          })
          .catch((err) => {
            res
              .status(500)
              .json({ error: false, message: "SQL ERROR", data: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: false, message: "SQL ERROR", data: err });
    });
});

router.get("/api/download-req-status-to-version", (req, res) => {
  const { upfilename, token } = req.query;
  const user = detokn(req.headers.authorization?.split("Bearer ")[1] ?? token);
  const query =
    'SELECT * FROM Requests WHERE author="' +
    user?.user_email +
    '" AND upfilename="' +
    upfilename +
    '"';
  execSql(query)
    .then((sres) => {
      res.json(sres); // TODO: FIX LATER.
    })
    .catch((err) => {
      res.status(500).json({ error: false, message: "SQL ERROR" });
    });
});

router.get("/api/query-delete-request", (req, res) => {
  const { upfilename, token } = req.query;
  const user = detokn(req.headers.authorization?.split("Bearer ")[1] ?? token);
  const QUERY_DELETE_REQUEST =
    'delete from Requests where requester="' +
    req.query.email +
    '" AND upfilename="' +
    upfilename +
    '"';
  execSql(QUERY_DELETE_REQUEST)
    .then((sres) => {
      res.json(sres); // TODO: FIX LATER.
    })
    .catch((err) => {
      res.status(500).json({ error: false, message: "SQL ERROR" });
    });
});

router.get("/api/download-req-filename", (req, res) => {
  const { upfilename, token } = req.query;
  const user = detokn(req.headers.authorization?.split("Bearer ")[1] ?? token);
  const query =
    'SELECT * FROM Requests WHERE author="' +
    user?.user_email +
    '" AND upfilename="' +
    upfilename +
    '"';
  execSql(query)
    .then((sres) => {
      res.json(sres); // TODO: FIX LATER.
    })
    .catch((err) => {
      res.status(500).json({ error: false, message: "SQL ERROR" });
    });
});

router.get("/api/query-delete-request", (req, res) => {
  const { upfilename, token } = req.query;
  const user = detokn(req.headers.authorization?.split("Bearer ")[1] ?? token);
  const query =
    'delete from Requests where requester="' +
    req.query.email +
    '" AND upfilename="' +
    upfilename +
    '"';
  execSql(query)
    .then((sres) => {
      res.json(sres); // TODO: FIX LATER.
    })
    .catch((err) => {
      res.status(500).json({ error: false, message: "SQL ERROR" });
    });
});

router.get("/api/download-req-filename", function (req, res) {
  const { upfilename } = req.query;
  const user = detokn(token);
  const query = 'SELECT * FROM Requests WHERE upfilename="' + upfilename + '"';
  if (user?.email) {
    execSql(query)
      .then((sres) => {
        res.json(sres); // TODO: FIX LATER.
      })
      .catch((err) => {
        res.status(500).json({ error: false, message: "SQL ERROR" });
      });
  }
});

router.post("/api/download-req-create", function (req, res) {
  const { token } = req.query;
  const { comment, upfilename, upfilenameMD, author } = req.body;
  const user = detokn(token);
  if (!user?.user_email) {
    res.status(400).json({ error: true, message: "Parse error" });
  }
  var query = `INSERT INTO Requests VALUES (
     '${upfilename}' ,
     '${upfilenameMD}' ,
     '${user.user_email}' ,
     '${author}' ,
     'requested' ,
     '${comment}' ,
     'BLANK'
    )`;

  execSql(query)
    .then((sres) => {
      res.json(sres); // TODO: FIX LATER.
    })
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        res.json({ error: "ER_DUP_ENTRY" }); // FIX FORMAT LATER
      } else res.status(500).json({ error: false, message: "SQL ERROR" });
    });
});

// TODO: FORMAT
router.get("/api/requests", function (req, res) {
  const { token } = req.query;
  const user = detokn(token);
  if (user) {
    const query =
      'SELECT * FROM Requests WHERE requester="' + user.user_email + '"';
    execSql(query)
      .then((sres) => {
        res.json(sres); // TODO: FIX LATER.
      })
      .catch((err) => {
        res.status(500).json({ error: false, message: "SQL ERROR", data: err });
      });
  } else res.status(401).json("ERROR");
});

router.get("/api/requests-tome", function (req, res) {
  const { token } = req.query;
  const user = detokn(token);
  if (user) {
    const query =
      'SELECT * FROM Requests WHERE author="' + user.user_email + '"';
    execSql(query)
      .then((sres) => {
        res.json(sres); // TODO: FIX LATER.
      })
      .catch((err) => {
        res.status(500).json({ error: false, message: "SQL ERROR", data: err });
      });
  } else res.status(401).json("ERROR");
});

router.get("/api/download-req-dataset", function (req, res) {
  const user = detokn(token);
  if (user) {
    const query =
      'SELECT * FROM Requests WHERE author="' + user.user_email + '"';
    execSql(query)
      .then((sres) => {
        res.json(sres); // TODO: FIX LATER.
      })
      .catch((err) => {
        res.status(500).json({ error: false, message: "SQL ERROR", data: err });
      });
  } else res.status(401).json("ERROR");
});

// TODO: FORMAT
router.get("/api/request-new-dataset", function (req, res) {
  const { datasetid, token } = req.query;
  const user = detokn(token);
  if (user) {
    const query1 =
      'SELECT MAX( last_edit ) AS last_edit FROM Files WHERE database_id="' +
      datasetid +
      '"'; // + " = SELECT MAX( last_edit )";
    execSql(query1)
      .then((sres1) => {
        if (sres1.length === 0) {
          res
            .status(404)
            .json({
              error: false,
              message: "Dataset not found in the database!",
            });
        } else {
          const last_edit_value = sres1[0].last_edit;
          const query =
            'SELECT * FROM Files WHERE database_id="' +
            datasetid +
            '"' +
            'AND last_edit = "' +
            last_edit_value +
            '"';
          execSql(query)
            .then((sres) => {
              if (sres.length === 0) {
                res
                  .status(404)
                  .json({
                    error: false,
                    message: "Dataset not found in database",
                  });
              } else if (sres[0].verification === "rejected") {
                res
                  .status(401)
                  .json({ error: false, message: "Unverified Dataset" });
              } else if (
                sres[0].public !== "public" &&
                user.user_email !== sres[0].author_id
              ) {
                res
                  .status(401)
                  .json({
                    error: false,
                    message: "Error! Permission not granted",
                  });
              } else {
                upfilename = sres[0].upfilename;
                const file = "uploads/" + upfilename;
                res.download(file, upfilename, (err) => {
                  if (err) {
                    if (res.headersSent) {
                    } else {
                      res
                        .status(404)
                        .json({
                          error: false,
                          message: "Error! File not found in database",
                        });
                    }
                  }
                });
              }
            })
            .catch((err) => {
              res
                .status(500)
                .json({ error: false, message: "SQL ERROR", data: err });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: false, message: "SQL ERROR", data: err });
      });
  } else {
    res.status(401).json("ERROR");
  }
});

// TODO:  FORMAT
router.post("/api/request-action", function (req, res) {
  const { token } = req.query;
  const { action, upfilename, requester, author } = req.body;
  const user = detokn(token);
  const query =
    "UPDATE Requests Set stat = '" +
    action +
    "' WHERE upfilename=\"" +
    upfilename +
    '" AND requester="' +
    requester +
    '" AND author="' +
    author +
    '"';

  if (user && user.user_email === author) {
    // SAFE for now but change later, query asserts author
    execSql(query)
      .then((sres) => {
        res.json(sres); // TODO: FIX LATER.
      })
      .catch((err) => {
        if (err.code === "ER_DUP_ENTRY") {
          res.json({ error: "ER_DUP_ENTRY" }); // FIX FORMAT LATER
        } else res.status(500).json({ error: false, message: "SQL ERROR" });
      });
  } else res.status(401).json("unauthorized");
});

// router.post()

module.exports = router;
