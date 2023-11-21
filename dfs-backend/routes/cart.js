const express = require('express');
const router = express.Router();
const { execSql } = require('../db');
const stripe = require('stripe')('sk_test_51O67C9SF7qIZIHjVWUKiy2Wdw1eDEfX7au1OvilQzqujdxJwqxPr3lCGXwdFbReP8V0ky4Cxcm306RcfqsJzEpPt00tHUUe23x');
// POST request to add a row to the cartitems table
router.post('/api/cart', async (req, res) => {
  const ItemId = req.body.ItemID;
  const UserId = req.body.UserId;
  let version = req.body.versionId;
  console.log(ItemId, UserId, version)
  if (version != null) {
    const query = `INSERT INTO CartItems (ItemID, UserID,versionId) VALUE ("` + ItemId + `", "` + UserId + `" , "` + version + `")`;
    await execSql(query).then(result => {
      res.sendStatus(200)
    }).catch(err => {
      res.sendStatus(400)
    });
  }
  else {
    const query2 = `SELECT databaseVersion_id, MAX(created_date) AS max_created_date FROM Files where database_id = '${ItemId}' GROUP BY databaseVersion_id ORDER BY max_created_date DESC LIMIT 1 `;
    await execSql(query2).then(async (result) => {
      version = result[0]["databaseVersion_id"]
      const query = `INSERT INTO CartItems (ItemID, UserID,versionId) VALUE ("` + ItemId + `", "` + UserId + `" , "` + version + `")`;
      await execSql(query).then(result => {
        res.sendStatus(200)
      }).catch(err => {
        res.sendStatus(400)
      });
    }).catch(err => {
      console.log(err)
      res.sendStatus(400)
    });
  }
});

router.post('/api/get-cart', async (req, res) => {
  let UserId = req.body["params"]["UserId"];
  const query = `select CartItems.*, Dataset.* from CartItems JOIN Dataset ON CartItems.ItemId = Dataset.dataset_id where CartItems.UserId = '${UserId}'`
  await execSql(query).then(async (result) => {
    res.send(result)
  }).catch(err => {
    console.log(err)
    res.sendStatus(400)
  });
});

// GET request to check if the itemID is present for the given userID in the userdatasets table
router.post('/api/remove-cart-item', async (req, res) => {
  const UserID = req.body.UserId;
  const ItemID = req.body.ItemID;
  let version = req.body.versionId;
  if (version != null) {
    const query = `DELETE FROM CartItems WHERE UserID = "` + UserID + `"` + ` AND ItemID = "` + ItemID + `"` + ` AND versionId = "` + version + `"`;
    await execSql(query).then(result => {
      res.sendStatus(200)
    }).catch(err => {
      res.sendStatus(400)
    });
  }
  else {
    const query2 = `SELECT databaseVersion_id, MAX(created_date) AS max_created_date FROM Files where database_id = '${ItemID}' GROUP BY databaseVersion_id ORDER BY max_created_date DESC LIMIT 1 `;
    await execSql(query2).then(async (result) => {
      version = result[0]["databaseVersion_id"]
      const query = `DELETE FROM CartItems WHERE UserID = "` + UserID + `"` + ` AND ItemID = "` + ItemID + `"` + ` AND versionId = "` + version + `"`;
      await execSql(query).then(result => {
        res.sendStatus(200)
      }).catch(err => {
        res.sendStatus(400)
      });
    }).catch(err => {
      console.log(err)
      res.sendStatus(400)
    });
  }
});
router.post('/api/create-checkout-session', async (req, res) => {
  let amount = req.body.params.amount
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          unit_amount: amount * 100,
          product_data: {
            name: "Datasets"
          },
        },
        quantity: 1
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/successPage`,
    cancel_url: `http://localhost:3000/failurePage`
  });
  res.send(session);
});
router.post('/api/done-purchase', async (req, res) => {
  let user = req.body.params.UserId
  let query = `select * from CartItems where UserId = '${user}'`
  await execSql(query).then(async (result) => {
    if (result.length > 0) {
      let str = ""
      for (let i of result) {
        if (str != "") {
          str += ","
        }
        str += `('${i.ItemID}','${i.UserID}','${i.versionId}')`
      }
      query = `INSERT INTO PurchaseItems values ${str}`
      console.log(query)
      await execSql(query).then(async (result) => {
        query = `DELETE FROM CartItems where UserId = '${user}'`
        await execSql(query).then(async (result) => {
          res.sendStatus(200)
        }).catch(err => {
          console.log(err)
          res.sendStatus(400)
        });
      }).catch(err => {
        console.log(err)
        res.sendStatus(400)
      });
    }
    else{
      res.sendStatus(200)
    }
  }).catch(err => {
    console.log(err)
    res.sendStatus(400)
  });
});
module.exports = router;
