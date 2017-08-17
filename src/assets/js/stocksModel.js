module.exports = function createDefaultStocks() {
  return [{
    symbol: "TEA",
    type: "Common",
    lastDividend: "0",
    fixedDividend: "8%",
    parValue: "100"
  },{
    symbol: "POP",
    type: "Common",
    lastDividend: "8",
    fixedDividend: "3%",
    parValue: "100"
  },{
    symbol: "ALE",
    type: "Common",
    lastDividend: "23",
    fixedDividend: "5%",
    parValue: "60"
  },{
    symbol: "GIN",
    type: "Preferred",
    lastDividend: "8",
    fixedDividend: "2%",
    parValue: "100"
  },{
    symbol: "JOE",
    type: "Common",
    lastDividend: "13",
    fixedDividend: "3%",
    parValue: "250"
  }];
}
