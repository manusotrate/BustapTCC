import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // ← Importe o AuthGuard


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard] // ← Protege a rota home
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
    
    path: '',
    redirectTo: 'inicial',
    pathMatch: 'full'
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoModule)
  
  },
  {
    path: 'tickets',
    loadChildren: () => import('./tickets/tickets-module').then( m => m.TicketsModule)
  },
  {
    path: 'timer',
    loadChildren: () => import('./timer/timer.module').then( m => m.TimerPageModule)
  },
  {
    path: 'inicial',
    loadChildren: () => import('./inicial/inicial.module').then( m => m.InicialPageModule)
  },
  {
    path: 'comprar-tickets',
    loadChildren: () => import('./comprar-tickets/comprar-tickets.module').then( m => m.ComprarTicketsPageModule)
  }


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard] // ← Protege a rota home
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
    
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'historico',
    loadChildren: () => import('./historico/historico.module').then( m => m.HistoricoModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./tickets/tickets-module').then( m => m.TicketsModule)
  },
  {
    path: 'timer',
    loadChildren: () => import('./timer/timer.module').then( m => m.TimerPageModule)
  },
  {
    path: 'horarios',
    loadChildren: () => import('./horarios/horarios.module').then( m => m.HorariosPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}