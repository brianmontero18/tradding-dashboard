import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { IStock } from '../logro/stock';

@Injectable()
export class StockService {
    private stocksUrl = 'http://localhost:8080/api/stocks';

    constructor (private http: Http) {}

    // get("/api/stocks")
    getAllStocks(): Promise<IStock[]> {
      return this.http.get(this.stocksUrl)
                 .toPromise()
                 .then(response => response.json() as IStock[])
                 .catch(this.handleError);
    }

    // get("/api/stocks/:symbol")
    getStockBySymbol(getStock: String): Promise<void | IStock[]> {
      return this.http.get(this.stocksUrl + '/' + getStock)
                 .toPromise()
                 .then(response => response.json() as IStock[])
                 .catch(this.handleError);
    }

    // put("/api/stocks/:symbol")
    updateStock(symbol : string, bodyReq: object): Promise<void | IStock> {
      var putUrl = this.stocksUrl + '/' + symbol;
      return this.http.put(putUrl, bodyReq)
                 .toPromise()
                 .then(response => response.json() as IStock)
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
}
