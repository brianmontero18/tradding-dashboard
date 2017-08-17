export interface Trade {
  _id?: string;
  stockSymbol: string;
  timestamp: string;
  quantity : number;
  tradePrice : number;
}
