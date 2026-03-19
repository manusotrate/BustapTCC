import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recarga',
    loadChildren: () => import('./recarga/recarga.module').then(m => m.RecargaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule)
  },
  {
    path: 'suporte',
    loadChildren: () => import('./suporte/suporte.module').then(m => m.SuporteModule)
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then(m => m.HistoricoModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inicial',
    loadChildren: () => import('./inicial/inicial.module').then(m => m.InicialPageModule)
  },
  {
    path: 'comprar-tickets',
    loadChildren: () => import('./comprar-tickets/comprar-tickets.module').then(m => m.ComprarTicketsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'horarios',
    loadChildren: () => import('./horarios/horarios.module').then(m => m.HorariosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'trip',
    loadChildren: () => import('./trip/trip.module').then(m => m.TripPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'inicial',
    pathMatch: 'full'
  },
  {
    path: 'metodo-pagamento',
    loadChildren: () => import('./metodo-pagamento/metodo-pagamento.module').then( m => m.MetodoPagamentoModule)
  },
  {
    path: 'recarga-pix',
    loadChildren: () => import('./recarga-pix/recarga-pix.module').then( m => m.RecargaPixModule)
  },
  {
    path: 'recarga-debito',
    loadChildren: () => import('./recarga-debito/recarga-debito.module').then( m => m.RecargaDebitoModule)
  },
  {
    path: 'recarga/metodo',
    loadChildren: () => import('./metodo-pagamento/metodo-pagamento.module')
      .then(m => m.MetodoPagamentoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recarga/pix',
   loadChildren: () => import('./recarga-pix/recarga-pix.module')
      .then(m => m.RecargaPixModule),
   canActivate: [AuthGuard]
  },
  {
    path: 'recarga/debito',
    loadChildren: () => import('./recarga-debito/recarga-debito.module')
      .then(m => m.RecargaDebitoModule),
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}