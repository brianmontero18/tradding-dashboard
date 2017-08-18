import { Component, OnInit, Input } from '@angular/core';
import { IStock } from '../../models/stock';
import { Trade } from '../../models/trade';
import { StockDetail } from '../../models/stock.detail';
import { StockService } from '../../services/stock.service';
import { TradeService } from '../../services/trade.service';
import initDemo = require('../../../assets/js/charts.js');
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-logro',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {

  logro : IStock;
  stockDetail : StockDetail;
  labels : Array<string>;
  series : Array<number>;
  dataDailySalesChart : object;
  @Input() onViewStockDetail : Subject<IStock>;
  constructor(
    private stockService : StockService,
    private tradeService : TradeService
  ) { }

  ngOnInit() {
    this.stockDetail = {
      symbol : '',
      trades : [],
      price  : ''
    };
    this.onViewStockDetail.subscribe(event => {
      this.viewStockDetail(event);
    });
  }

  ngOnDestroy() {
    this.onViewStockDetail.unsubscribe();
  }

  viewStockDetail(stock: IStock) {
    if(stock) {
      this.tradeService.getTradesByStock(stock.symbol).then((trades: Trade[]) => {
        this.stockDetail = {
          symbol : stock.symbol,
          trades : trades,
          price  : this.calculateStockPrice(trades)
        };
        stock.price = this.stockDetail.price;
        this.stockService.updateStock(stock.symbol, stock);
        this.dataDailySalesChart = {
          labels : this.labels,
          series : [this.series]
        };
        initDemo(this.dataDailySalesChart);
      });
    }
  }

  private calculateStockPrice = (trades : Trade[]) : string => {
    let sumatory = 0;
    let totalStocks = 0;
    this.labels = [];
    this.series = [];
    trades.forEach((trade) => {
      sumatory += trade.tradePrice * trade.quantity;
      totalStocks += trade.quantity;
      this.labels.push(trade.timestamp.split('T')[1].substring(0,5));
      this.series.push(trade.tradePrice);
    });
    return (sumatory/totalStocks).toFixed(2).toString();
  }

}
