import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  userName = 'Usuário';
  balance = 'R$ 0,00';

  constructor() {}

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario() {
    try {
      // Pegar dados do usuário do localStorage
      const usuarioSalvo = localStorage.getItem('usuario');
      
      if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        this.userName = usuario.nome || 'Usuário';
        
        // Aqui você pode adicionar lógica para buscar o saldo real
        // Por enquanto vamos deixar como R$ 0,00
        this.balance = 'R$ 0,00';
        
        console.log('Dados do usuário carregados:', usuario);
      } else {
        console.log('Nenhum usuário encontrado no localStorage');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      this.userName = 'Usuário';
    }
  }
}