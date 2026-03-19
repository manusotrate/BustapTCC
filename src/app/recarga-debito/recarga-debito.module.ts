import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RecargaDebitoPage } from './recarga-debito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: RecargaDebitoPage }
    ])
  ],
  declarations: [RecargaDebitoPage]
})
export class RecargaDebitoModule {}