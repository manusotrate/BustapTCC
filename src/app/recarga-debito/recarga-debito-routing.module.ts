import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecargaDebitoPage } from './recarga-debito.page';

const routes: Routes = [
  {
    path: '',
    component: RecargaDebitoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecargaDebitoPageRoutingModule {}
