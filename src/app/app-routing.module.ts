import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TradeComponent } from './components/trade/trade.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {path: '', component: DashboardComponent},
      {path: ':id', component: TradeComponent}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule{}
