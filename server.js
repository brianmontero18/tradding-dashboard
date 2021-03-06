var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var STOCKS_COLLECTION = "stocks";
var TRADES_COLLECTION = "trades";

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

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
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
    generateDefaultStock();
  });
});

// STOCKS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/stocks"
 *    GET: finds all stocks
 *    POST: creates a new stock
 */

 app.get("/api/stocks", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(STOCKS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get stocks.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/stocks", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  var newStock = req.body;
  newStock.createDate = new Date();

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(STOCKS_COLLECTION).insertOne(newStock, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new stock.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
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
    if (err) {
      handleError(res, err.message, "Failed to get stock");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  var updateDoc = req.body;

  db.collection(STOCKS_COLLECTION).updateOne(
    {symbol: req.params.symbol}, {$set: updateDoc}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update stock");
    } else {
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/stocks/:symbol", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(STOCKS_COLLECTION).deleteOne({_id: new ObjectID(req.params.symbol)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete stock");
    } else {
      res.status(200).json(req.params.symbol);
    }
  });
});


// ********************** TRADES API ************************* //

/*  "/api/trades"
 *    GET: finds all trades
 */

app.get("/api/trades", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(TRADES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get trades.");
    } else {
      res.status(200).json(docs);
    }
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
      if (err) {
        handleError(res, err.message, "Failed to get trades");
      } else {
        res.status(200).json(doc);
      }
    });
});

/*  "/api/trades"
 *    DELETE: delete all trades
 */

app.delete("/api/trades", function(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  db.collection(TRADES_COLLECTION).remove({}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete trades");
    } else {
      res.status(200).json(req.params.symbol);
    }
  });
});


// ************************* GENERATE DEFAULT DATA ****************************
// STOCKS
function generateDefaultStock() {
  try {
    db.collection(STOCKS_COLLECTION).remove({});
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
      db.collection(STOCKS_COLLECTION).insertOne(stock);
    });
  } catch (e) {
    console.log(e);
  };
}

//TRADES
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
