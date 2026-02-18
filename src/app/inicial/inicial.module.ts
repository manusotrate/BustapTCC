import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { InicialPageRoutingModule } from './inicial-routing.module';
import { InicialPage } from './inicial.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    InicialPageRoutingModule
  ],
  declarations: [InicialPage]
})
export class InicialPageModule {}
