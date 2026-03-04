import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprarTicketsPage } from './comprar-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: ComprarTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprarTicketsPageRoutingModule {}
