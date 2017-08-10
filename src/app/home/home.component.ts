import { Component, OnInit } from '@angular/core';
import { StockService } from './stock.service';
import { TradeService } from '../logro/trade.service';
import { IStock } from '../logro/stock';
import { Trade } from '../logro/trade';
import { LogroComponent } from '../logro/logro.component';
import { StockDetail } from '../logro/stock.detail';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [StockService, TradeService]
})
export class HomeComponent implements OnInit {

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
      stocksList.forEach((stock) => {
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
