const express = require("express");
const router = express.Router();
const { execSql } = require("../../db");
const { detokn } = require("../auth/utils");

const {
  doesGroupAdminExist,
  doesGroupMemberExist,
  isGroupNameNew,
} = require("../../helpers/groups");
const { doesUserExist } = require("../../helpers/users");

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

router.get("/api/groups", (req, res) => {
  const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
  const email = user?.user_email;
  if (email) {
    const QUERY_VIEW_GROUPS = req.query.creator
      ? `SELECT * FROM DatasetGroups WHERE user_id="${email}"`
      : `SELECT * FROM DatasetGroups WHERE user_id="${email}" AND user_role="CREATOR"`;
    execSql(QUERY_VIEW_GROUPS)
      .then((sqlres) => {
        res.json({
          error: false,
          data: sqlres,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: true,
          data: err,
        });
      });
  } else {
    res.status(401).json("unauthorized");
  }
});

router.post('/api/query-add-group-dataset-request', (req, res) => {
  const { comment, upfilename, upfilenameMD, author,groupID } = req.body;
  if(!groupID){
    res.status(400).json({error: true, message: 'Parse error'});
  }
  if(author !== req.body.email){
    res.status(400).json({error: true, message: 'You are not the author'});
  }
  const QUERY_ADD_GROUP_DATASET_REQUEST = `INSERT INTO Requests VALUES (
     '${upfilename}' ,
     '${upfilenameMD}' ,
     '${groupID}' ,
     '${author}' ,
     'accepted' ,
     '${comment}' ,
     'BLANK'
    )`;
  execSql(QUERY_ADD_GROUP_DATASET_REQUEST)
  .then(sres => {
    res.json(sres); 
  })
});
router.get("/api/group-members", (req, res) => {
  const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
  const email = user?.user_email;
  const { group_id } = req.query;
  if (email) {
    const QUERY_VIEW_GROUP_MEMBERS = `SELECT * FROM DatasetGroups WHERE group_id="${group_id}"`;
    execSql(QUERY_VIEW_GROUP_MEMBERS)
      .then((sqlres) => {
        res.json({
          error: false,
          data: sqlres,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: true,
          data: err,
        });
      });
  } else {
    res.status(401).json("unauthorized");
  }
});

router.post("/api/create-group", (req, res) => {
  const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
  const email = user?.user_email;
  const group_name = req.query.groupName;
  if (email && group_name) {
    isGroupNameNew(group_name, email).then(() => {
      const group_id = create_UUID();
      const QUERY_CREATE_GROUP = `INSERT INTO DatasetGroups values("${group_id}", "${group_name}", "${email}", "CREATOR")`;
      execSql(QUERY_CREATE_GROUP)
        .then((sqlres) => {
          res.json({
            error: false,
            data: sqlres,
          });
        })
        .catch((err) => {
          if (err.code === "ER_DUP_ENTRY") {
            res.json({
              error: true,
              message: err.code,
            });
          } else {
            res.status(402);
          }
        });
    }).catch(err => {
      res.json({
        error: true, 
        data: 'Group Already Exists',
      })
    });
  } else {
    res.status(401).json("unauthorized");
  }
});

router.post("/api/add-to-group", (req, res) => {
  const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
  const { groupId: group_id, email: user_email } = req.body;
  if (group_id && user_email && user?.user_email) {
    doesUserExist(user_email)
      .then(() => {
        doesGroupAdminExist(group_id, user?.user_email ?? "")
          .then((gres) => {
            const QUERY_ADD_TO_GROUP = `INSERT INTO DatasetGroups values("${group_id}", "${gres.group_name}", "${user_email}", "MEMBER")`;
            execSql(QUERY_ADD_TO_GROUP)
              .then((sqlres) => {
                res.json({
                  error: false,
                  data: sqlres,
                });
              })
              .catch((err) => {
                if (err.code === "ER_DUP_ENTRY") {
                  res.json({
                    error: true,
                    message: err.code,
                  });
                } else {
                  res.status(400);
                }
              });
          })
          .catch((err) => {
            res.status(401).json({ message: "Unauthorized", error: true });
          });
      })
      .catch((err) => {
        res.status(400).json({ message: "invalid attributes", error: true });
      });
  } else {
    res.status(401).json("unauthorized");
  }
});

router.post("/api/remove-from-group", (req, res) => {
  const user = detokn(req.headers.authorization?.split("Bearer ")[1]);
  const creator_email = user?.user_email;
  const { groupId: group_id, email: user_email } = req.body;
  if (group_id && user_email && creator_email) {
    doesGroupMemberExist(group_id, user_email)
      .then(() => {
        doesGroupAdminExist(group_id, creator_email).then((gres) => {
          const QUERY_REMOVE_FROM_GROUP = `DELETE FROM DatasetGroups WHERE group_id="${group_id}" AND user_id="${user_email}"`;
          execSql(QUERY_REMOVE_FROM_GROUP)
            .then((sqlres) =>
              res.json({
                error: false,
                data: sqlres,
              })
            )
            .catch((err) =>
              res.status(400).json({
                error: true,
                message: "SQL Error",
                data: err,
              })
            );
        });
      })
      .catch((err) => {
        res.status(400).json({ message: "invalid attributes", error: true });
      });
  } else {
    res.status(401).json("unauthorized");
  }
});
module.exports = router;
