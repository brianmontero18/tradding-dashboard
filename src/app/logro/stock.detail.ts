import { Trade } from './trade';

export interface StockDetail {
  symbol: string,
  trades: Trade[],
  price: string
}
