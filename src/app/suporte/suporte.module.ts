import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SuporteComponent } from './suporte.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SuporteComponent,
    RouterModule.forChild([
      {
        path: '',
        component: SuporteComponent
      }
    ])
  ]
})
export class SuporteModule {}
