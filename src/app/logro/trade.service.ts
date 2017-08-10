import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Trade } from './trade';

@Injectable()
export class TradeService {
    private tradesUrl = 'http://localhost:8080/api/trades';

    constructor (private http: Http) {}

    // get("/api/trades")
    getAllTrades(): Promise<void | Trade[]> {
      return this.http.get(this.tradesUrl)
                 .toPromise()
                 .then(response => response.json() as Trade[])
                 .catch(this.handleError);
    }

    // get("/api/trades/:stockSymbol")
    getTradesByStock(getTrade: String): Promise<void | Trade[]> {
      return this.http.get(this.tradesUrl + '/' + getTrade)
                 .toPromise()
                 .then(response => response.json() as Trade[])
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }
}
