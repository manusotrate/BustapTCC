import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecargaPixPage } from './recarga-pix.page';

const routes: Routes = [
  {
    path: '',
    component: RecargaPixPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecargaPixPageRoutingModule {}
