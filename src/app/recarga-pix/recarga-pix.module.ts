import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RecargaPixPage } from './recarga-pix.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: RecargaPixPage }
    ])
  ],
  declarations: [RecargaPixPage]
})
export class RecargaPixModule {}