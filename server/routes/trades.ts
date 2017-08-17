import { Request, Response, Router } from "express";
import mongodb = require("mongodb");
import * as uuid from "uuid";

import DataAccess = require("../db/dashboard");

const tradesRouter: Router = Router();
const ObjectID = mongodb.ObjectID;
let dashboardDB : DataAccess.DashboardDB;
const TRADES_COLLECTION = "trades";

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code).json({"error": message});
}

/*  "/api/trades"
 *    GET: finds all trades
 */

dashboardDB = new DataAccess.DashboardDB();
dashboardDB.openDbConnection();

tradesRouter.get("/api/trades", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  dashboardDB.db.collection(TRADES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) handleError(res, err.message, "Failed to get trades.", 500);
    else res.status(200).json(docs);
  });
});

/*  "/api/trades/:stockSymbol"
 *    GET: find trades by stockSymbol
 */

tradesRouter.get("/api/trades/:stockSymbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  dashboardDB.db.collection(TRADES_COLLECTION)
    .find({ stockSymbol: req.params.stockSymbol })
    .sort({_id:-1})
    .limit(7)
    .toArray(function(err, doc) {
      if (err) handleError(res, err.message, "Failed to get trades", 500);
      else res.status(200).json(doc);
    });
});

/*  "/api/trades"
 *    DELETE: delete all trades
 */

tradesRouter.delete("/api/trades", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  dashboardDB.db.collection(TRADES_COLLECTION).remove({}, function(err, result) {
    if (err) handleError(res, err.message, "Failed to delete trades", 500);
    else res.status(200).json(req.params.symbol);
  });
});

// ************************* TRADES GENERATOR ****************************

let stocksArr = ["TEA", "POP", "ALE", "GIN", "JOE"];
setInterval(function() {
  console.log('*** Generate Random Trade ***');
    var newTrade = {
      stockSymbol: stocksArr[Math.floor(Math.random()*5)],
      timestamp: new Date(),
      quantity: Math.floor((Math.random() * 100) + 1),
	    tradePrice: Math.floor((Math.random() * 50) + 1)
    }

    try {
      dashboardDB.db.collection(TRADES_COLLECTION).insertOne(newTrade);
    } catch (e) {
       console.log(e);
    };
}, 1000);

setTimeout(function() {
  dashboardDB.generateDefaultStock();
}, 30000);

export { tradesRouter };
