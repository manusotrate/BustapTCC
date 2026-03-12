import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RecargaComponent } from './recarga.component';
import { PaymentService } from '../services/payment.service';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: RecargaComponent
      }
    ])
  ],
  declarations: [RecargaComponent],
  providers: [PaymentService]
})
export class RecargaModule {}