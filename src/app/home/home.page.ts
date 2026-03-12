import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  userName = '';
  balance = 'R$ 0,00';
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario() {
    const usuarioLocal = this.authService.getUsuarioLocal();
    
    if (usuarioLocal) {
      this.userName = usuarioLocal.nome;
      this.usuario = usuarioLocal;
    }

    this.authService.obterUsuario().subscribe({
      next: (response) => {
        this.usuario = response.usuario;
        this.userName = response.usuario.nome;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário:', err);
        if (err.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  logout() {
    this.authService.logout();
  }
  gosuporte() {
    this.router.navigate(['/suporte']);
  }
  gorecarga() {
    this.router.navigate(['/recarga']);
  }
  gohistorico() {
    this.router.navigate(['/historico']);
  }
  gotickets() {
    this.router.navigate(['/tickets']);
  }
}
