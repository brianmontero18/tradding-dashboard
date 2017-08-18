import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as path from "path";
import { serverPort } from "./config";
import mongodb = require("mongodb");

const app: express.Application = express();
app.use(json());
// in production mode run application from dist folder
app.use(express.static(path.join(__dirname, "../../client")));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
const ObjectID = mongodb.ObjectID;
const STOCKS_COLLECTION = "stocks";
const TRADES_COLLECTION = "trades";

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost/dashboard', function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(serverPort, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
    generateDefaultStock();
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code).json({"error": message});
}


// ************************* GENERATE DEFAULT DATA ****************************
// STOCKS
function generateDefaultStock() {
  try {
    db.collection('stocks').remove({});
  } catch (e) {
    console.log(e);
  };

  let stocksList = [
    {symbol: "TEA", type: "Common", lastDividend: "0", fixedDividend: "8%", parValue: "100", price: "10"},
    {symbol: "POP", type: "Common", lastDividend: "8", fixedDividend: "3%", parValue: "100", price: "20"},
    {symbol: "ALE", type: "Common", lastDividend: "23", fixedDividend: "5%", parValue: "60", price: "30"},
    {symbol: "GIN", type: "Preferred", lastDividend: "8", fixedDividend: "2%", parValue: "100", price: "8"},
    {symbol: "JOE", type: "Common", lastDividend: "13", fixedDividend: "3%", parValue: "250", price: "40"}
  ];

  console.log('*** Generate Default Stock List ***');
  try {
    stocksList.forEach((stock) => {
      db.collection('stocks').insertOne(stock);
    });
  } catch (e) {
    console.log(e);
  };
}

/*  "/api/stocks"
 *    GET: finds all stocks
 *    POST: creates a new stock
 */

app.get("/api/stocks", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(STOCKS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) handleError(res, err.message, "Failed to get stocks.", 500);
    else res.status(200).json(docs);
  });
});

app.post("/api/stocks", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Credentials','true');
  var newStock = req.body;
  newStock.createDate = new Date();

  if (!req.body.name)
    handleError(res, "Invalid user input", "Must provide a name.", 400);

  db.collection(STOCKS_COLLECTION).insertOne(newStock, function(err, doc) {
    if (err) handleError(res, err.message, "Failed to create new stock.", 500);
    else res.status(201).json(doc.ops[0]);
  });
});

/*  "/api/stocks/:symbol"
 *    GET: find stock by symbol
 *    PUT: update stock by symbol
 *    DELETE: deletes stock by symbol
 */

app.get("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(STOCKS_COLLECTION).findOne({ symbol: req.params.symbol }, function(err, doc) {
    if (err) handleError(res, err.message, "Failed to get stock", 500);
    else res.status(200).json(doc);
  });
});

app.put("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  var updateDoc = req.body;

  db.collection(STOCKS_COLLECTION).findAndModify( {symbol: req.params.symbol}, [['_id','asc']], {$set: {price: updateDoc.price}},{}, function(err, doc) {
    if (err) handleError(res, err.message, "Failed to update stock", 500);
    else res.send(doc);
  });
});

app.delete("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(STOCKS_COLLECTION).deleteOne({_id: new ObjectID(req.params.symbol)}, function(err, result) {
    if (err) handleError(res, err.message, "Failed to delete stock", 500);
    else res.status(200).json(req.params.symbol);
  });
});

/*  "/api/trades"
 *    GET: finds all trades
 */

app.get("/api/trades", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(TRADES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) handleError(res, err.message, "Failed to get trades.", 500);
    else res.status(200).json(docs);
  });
});

/*  "/api/trades/:stockSymbol"
 *    GET: find trades by stockSymbol
 */

app.get("/api/trades/:stockSymbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(TRADES_COLLECTION)
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

app.delete("/api/trades", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(TRADES_COLLECTION).remove({}, function(err, result) {
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
      db.collection(TRADES_COLLECTION).insertOne(newTrade);
    } catch (e) {
       console.log(e);
    };
}, 1000);
