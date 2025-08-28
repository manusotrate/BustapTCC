import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CadastroComponent } from '../cadastro/cadastro.component';  // ✅ Importa o CadastroComponent diretamente

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CadastroComponent // Usa diretamente o CadastroComponent
      }
    ])
  ],
  exports: [] // Não precisa exportar, já que o componente é standalone
})
export class CadastroModule {}
