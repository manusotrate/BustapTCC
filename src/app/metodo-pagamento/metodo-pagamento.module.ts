import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MetodoPagamentoPage } from './metodo-pagamento.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: MetodoPagamentoPage }
    ])
  ],
  declarations: [MetodoPagamentoPage]
})
export class MetodoPagamentoModule {}