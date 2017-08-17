const MongoClient = require('mongodb').MongoClient;

export class DashboardDB{
  db:any;

  public openDbConnection() {
    MongoClient.connect('mongodb://localhost:27017/dashboard', (err, db) => {
      if (err) return console.log(err);
      this.db = db;
  });
}


  // ************************* GENERATE DEFAULT DATA ****************************
  // STOCKS
  public generateDefaultStock() {
    try {
      this.db.collection('stocks').remove({});
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
        this.db.collection('stocks').insertOne(stock);
      });
    } catch (e) {
      console.log(e);
    };
  }
}
