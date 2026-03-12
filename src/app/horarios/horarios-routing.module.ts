import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorariosPage } from './horarios.page';

const routes: Routes = [
  {
    path: '',
    component: HorariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorariosPageRoutingModule {}
