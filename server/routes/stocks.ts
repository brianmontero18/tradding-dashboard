import { Request, Response, Router } from "express";
import mongodb = require("mongodb");
import * as uuid from "uuid";

import DataAccess = require("../db/dashboard");

const stocksRouter: Router = Router();
const ObjectID = mongodb.ObjectID;
let dashboardDB : DataAccess.DashboardDB;
const STOCKS_COLLECTION = "stocks";

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code).json({"error": message});
}

/*  "/api/stocks"
 *    GET: finds all stocks
 *    POST: creates a new stock
 */

dashboardDB = new DataAccess.DashboardDB();
dashboardDB.openDbConnection();

 stocksRouter.get("/api/stocks", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  dashboardDB.db.collection(STOCKS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) handleError(res, err.message, "Failed to get stocks.", 500);
    else res.status(200).json(docs);
  });
});

stocksRouter.post("/api/stocks", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Credentials','true');
  var newStock = req.body;
  newStock.createDate = new Date();

  if (!req.body.name)
    handleError(res, "Invalid user input", "Must provide a name.", 400);

  dashboardDB.db.collection(STOCKS_COLLECTION).insertOne(newStock, function(err, doc) {
    if (err) handleError(res, err.message, "Failed to create new stock.", 500);
    else res.status(201).json(doc.ops[0]);
  });
});

/*  "/api/stocks/:symbol"
 *    GET: find stock by symbol
 *    PUT: update stock by symbol
 *    DELETE: deletes stock by symbol
 */

stocksRouter.get("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  dashboardDB.db.collection(STOCKS_COLLECTION).findOne({ symbol: req.params.symbol }, function(err, doc) {
    if (err) handleError(res, err.message, "Failed to get stock", 500);
    else res.status(200).json(doc);
  });
});

stocksRouter.put("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  var updateDoc = req.body;

  dashboardDB.db.collection(STOCKS_COLLECTION).findOneAndUpdate( {symbol: req.params.symbol}, updateDoc, function(err, doc) {
    if (err) handleError(res, err.message, "Failed to update stock", 500);
    else res.send(doc);
  });
});

stocksRouter.delete("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  dashboardDB.db.collection(STOCKS_COLLECTION).deleteOne({_id: new ObjectID(req.params.symbol)}, function(err, result) {
    if (err) handleError(res, err.message, "Failed to delete stock", 500);
    else res.status(200).json(req.params.symbol);
  });
});

export { stocksRouter };
