import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    // Primeiro, tenta carregar do localStorage
    const usuarioLocal = this.authService.getUsuarioLocal();
    
    if (usuarioLocal) {
      this.userName = usuarioLocal.nome;
      this.usuario = usuarioLocal;
    }

    // Depois, busca dados atualizados do backend
    this.authService.obterUsuario().subscribe({
      next: (response) => {
        this.usuario = response.usuario;
        this.userName = response.usuario.nome;
        // Aqui você pode adicionar lógica para carregar o saldo do usuário
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário:', err);
        // Se der erro de autenticação, faz logout
        if (err.status === 401) {
          this.authService.logout();
        }
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}