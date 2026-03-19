import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComprarTicketsPageRoutingModule } from './comprar-tickets-routing.module';
import { ComprarTicketsPage } from './comprar-tickets.page';
import { PaymentService } from '../services/payment.service';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ComprarTicketsPageRoutingModule
  ],
  declarations: [ComprarTicketsPage],
  providers: [PaymentService]
})
export class ComprarTicketsPageModule {}