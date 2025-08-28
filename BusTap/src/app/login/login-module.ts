import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';  // ✅ Importa o LoginComponent diretamente

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent // Usa diretamente o LoginComponent
      }
    ])
  ],
  exports: [] // Não precisa exportar, já que o componente é standalone
})
export class LoginModule {}
