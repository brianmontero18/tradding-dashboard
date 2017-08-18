import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { IStock } from '../models/stock';

@Injectable()
export class StockService {
    private apiUrl = '/api/stocks';

    constructor (private http: Http) {}

    // get("/api/stocks")
    getAllStocks(): any {
      return this.http.get(this.apiUrl)
                 .toPromise()
                 .then(response => response.json() as IStock[])
                 .catch(this.handleError);
    }

    // get("/api/stocks/:symbol")
    getStockBySymbol(getStock: String): Promise<void | IStock[]> {
      return this.http.get(this.apiUrl + '/' + getStock)
                 .toPromise()
                 .then(response => response.json() as IStock[])
                 .catch(this.handleError);
    }

    // put("/api/stocks/:symbol")
    updateStock(symbol: string, bodyReq: IStock): Promise<void | IStock> {
      var putUrl = this.apiUrl + '/' + symbol;
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
