const express = require("express");
const router = express.Router();
const { execSql } = require("../db");
const { detokn } = require("./auth/utils");
const fs = require("fs");
const {
  doesGroupExist,
  doesGroupAdminExist,
  doesGroupMemberExist,
  isGroupNameNew,
} = require("../helpers/groups");
// make this a util function and replace all create_UUID with that util.
// Add params to adjust size of it, while having a default param for current functionality
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : r & (0x3 | 0x8)).toString(16);
    }
  );
  return uuid;
}

router.post("/api/create-comment", (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
    const uuid = create_UUID();
    if (user) {
      const {
        comment,
        format,
        tags,
        group_id, // I think this should be in params. Tell me why and then move it there.
      } = req.body;
      const author_id = user.user_email;
      const dataset_version_id = "";
      const comment_date = +new Date();
      const alias = user.first_name;
      if (user.user_email) {
        // check for group access of user through a util. Move the util to appropriate utils file.
        const QUERY_ADD_COMMENT = `INSERT INTO Comments values(
          '${uuid}',
          '${uuid}',
          '${comment}',
          '${format}',
          '${tags}',
          '${group_id}',
          '${author_id}',
          '${alias}',
          '${dataset_version_id}',
          ${comment_date},
          ${comment_date}
        )`;
        execSql(QUERY_ADD_COMMENT)
          .then((sqlres) => {
            res.json({
              error: false,
              data: sqlres,
              message: "Successfully Updated Model",
            });
          })
          .catch((err) => {
            if (err.code == "ER_DUP_ENTRY") {
              res.json({
                // change to approriate status
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
      }
    } else
      res.status(403).json({
        error: false,
        message: "user not logged in",
      });
  } else {
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
});

router.post("/api/edit-comment", async (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
    if (user) {
      doesGroupMemberExist(req.body.group_id, req.body.requester_id)
        .then((value) => {
          const currentTime = +new Date();
          const QUERY_EDIT_COMMENT = `UPDATE Comments SET comment = '${req.body.comment}', edit_date = '${currentTime}' WHERE comment_id = '${req.body.comment_id}'`;
          execSql(QUERY_EDIT_COMMENT)
            .then((sres) => {
              if (sres.affectedRows > 0) {
                res.json({
                  error: false,
                  data: sres,
                  message: "Comment Edited Successfully",
                });
              } else {
                res.status(500).json({
                  error: true,
                  data: sres,
                  message: "Comment does not exist",
                });
              }
            })
            .catch((err) => {
              res.status(500).json({
                error: true,
                data: err,
                message: err.code,
              });
            });
        })
        .catch((err) => {
          res.json({
            error: true,
          });
        });
    } else {
      res.status(403).json({
        error: true,
        message: "user not logged in",
      });
    }
  } else {
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
});

router.post("/api/add-comment", async (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
    if (user) {
      const author_id = user.user_email;
      const alias = user.first_name;
      doesGroupMemberExist(req.body.group_id, author_id)
        .then((value) => {
          const currentTime = +new Date();
          const comment_id = create_UUID();
          const QUERY_ADD_COMMENT = `INSERT INTO Comments VALUES ('${req.body.discussion_id}', 
      '${comment_id}', '${req.body.comment}', '${req.body.format}', 
      '${req.body.tags}','${req.body.group_id}', '${author_id}', 
      '${alias}','${req.body.dataset_version_id}','${currentTime}','${currentTime}')`;

          execSql(QUERY_ADD_COMMENT)
            .then((sres) => {
              res.json({
                error: false,
                data: sres,
                message: "Comment Added Successfully",
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: true,
                data: err,
                message: err.code,
              });
            });
        })
        .catch((err) => {
          res.json({
            error: true,
            data: err,
            message: err.code,
          });
        });
    } else {
      res.status(403).json({
        error: true,
        message: "user not logged in",
      });
    }
  } else {
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
});

router.post("/api/delete-comment", async (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
    if (user) {
      doesGroupMemberExist(req.body.group_id, req.body.requester_id)
        .then((value) => {
          const QUERY_DELETE_COMMENT = `DELETE FROM Comments WHERE comment_id = '${req.body.comment_id}'
        AND author_id = '${req.body.requester_id}'`;
          execSql(QUERY_DELETE_COMMENT)
            .then((qres) => {
              if (qres.affectedRows > 0) {
                res.json({
                  error: false,
                  data: qres,
                  message: "Comment Deleted Successfully",
                });
              } else {
                res.status(500).json({
                  error: true,
                  data: qres,
                  message: "Comment does not exist",
                });
              }
            })
            .catch((err) => {
              res.status(500).json({
                error: true,
                data: err,
                message: err.code,
              });
            });
        })
        .catch((err) => {
          res.json({
            error: true,
            data: err,
            message: err.code,
          });
        });
    } else {
      res.status(403).json({
        error: true,
        message: "user not logged in",
      });
    }
  } else {
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
});

router.post("/api/discussion", async (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
    if (user) {
      const author_id = user.user_email;
      doesGroupMemberExist(req.body.group_id, author_id)
        .then((value) => {
          const QUERY_CHECK_DISCUSSION = `SELECT * FROM Comments where discussion_id = '${req.body.discussion_id}'`;
          execSql(QUERY_CHECK_DISCUSSION).then((sres) => {
            if (sres.length > 0) {
              const QUERY_SELECT_COMMENT = `SELECT * FROM Comments where discussion_id = '${req.body.discussion_id}' and comment_id != discussion_id`;
              execSql(QUERY_SELECT_COMMENT)
                .then((sres) => {
                  res.json({
                    error: false,
                    data: sres,
                    message: "Comments retrieved successfully",
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    error: true,
                    data: err,
                    message: err.code,
                  });
                });
            } else {
              res.status(500).json({
                error: true,
                message: "Discussion Id does not exist",
              });
            }
          });
        })
        .catch((err) => {
          res.json({
            error: true,
            data: err,
            message: err.code,
          });
        });
    } else {
      res.status(403).json({
        error: true,
        message: "user not logged in",
      });
    }
  } else {
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
});

router.post("/api/comments", async (req, res) => {
  // through params,
  // {discussion_id } ordered by date
});

router.post("/api/group-comments", async (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
    if (user) {
      doesGroupMemberExist(req.body.group_id, req.body.requester_id)
        .then((value) => {
          const QUERY_TO_GET_COMMENTS = `SELECT * FROM Comments where author_id = '${req.body.requester_id}' and comment LIKE '%${req.body.text}%' LIMIT ${req.body.limit}`;
          execSql(QUERY_TO_GET_COMMENTS)
            .then((sres) => {
              res.json({
                error: false,
                data: sres,
                message: "Comments Retrieved Succesfully",
              });
            })
            .catch((err) => {
              res.status(500).json({
                err: true,
                data: err,
                message: err.code,
              });
            });
        })
        .catch((err) => {
          res.json({
            error: true,
            data: err,
            message: err.code,
          });
        });
    } else {
      res.status(403).json({
        error: true,
        message: "user not logged in",
      });
    }
  } else {
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
});

router.post("/api/group-discussions", async (req, res) => {
  if (req.headers.authorization) {
    const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
    if (user) {
      doesGroupMemberExist(req.body.group_id, user.user_email)
        .then((value) => {
          const QUERY_TO_CHECK_GROUP = `SELECT * FROM Comments where group_id = '${req.body.group_id}' and discussion_id = comment_id ORDER BY comment_date DESC`;
          execSql(QUERY_TO_CHECK_GROUP)
            .then((sres) => {
              res.json({
                error: false,
                data: sres,
                message: "Comments Retrieved Succesfully",
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: true,
                data: err,
                message: err.code,
              });
            });
        })
        .catch((err) => {
          res.status(500).json({
            error: true,
            data: err,
            message: err.code,
          });
        });
    } else {
      res.status(403).json({
        error: true,
        message: "user not logged in",
      });
    }
  } else {
    res.status(403).json({
      error: true,
      message: "user not logged in",
    });
  }
});

router.post("/api/");
module.exports = router;
