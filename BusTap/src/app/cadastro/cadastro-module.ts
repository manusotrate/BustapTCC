import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CadastroComponent } from './cadastro.component'; // <- use CadastroComponent

@NgModule({
  declarations: [CadastroComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [CadastroComponent] // opcional, mas útil se for usar fora do módulo
})
export class CadastroModule { }
