import { Component, OnInit } from '@angular/core';
import { IStock } from '../../models/stock';
import { Trade } from '../../models/trade';
import { StockDetail } from '../../models/stock.detail';
import { TradeComponent } from '../trade/trade.component';
import { StockService } from '../../services/stock.service';
import { TradeService } from '../../services/trade.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [StockService, TradeService]
})
export class DashboardComponent implements OnInit {

  stocksList : IStock[];
  stockDetail : StockDetail;
  mervalIndex : string = '0';
  onViewStockDetail : Subject<IStock> = new Subject();

  constructor(
    private stockService : StockService,
    private tradeService : TradeService
  ) { }

  ngOnInit() {
    this.calculateMervalIndex();

    setInterval(function() {
      this.calculateMervalIndex();
    }.bind(this), 5000);
  }

  calculateMervalIndex() : void {
    this.stockService.getAllStocks().then((stocksList) => {
      this.stocksList = stocksList;
      let stockPriceArr = [];
      this.stocksList.forEach((stock) => {
        stockPriceArr.push(parseInt(stock.price));
      });

      this.mervalIndex = Math.pow(
                            stockPriceArr.reduce(function(a,b){return a*b}), 1 / stockPriceArr.length
                        ).toFixed(2).toString();
    });
  }

  viewDetail(stock: IStock) : void {
    this.onViewStockDetail.next(stock);
  }
}
