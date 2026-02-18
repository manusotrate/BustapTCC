import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Ticket {
  duracao: string;
  quantidade: number;
}

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  standalone: false
})
export class TicketsComponent implements OnInit {

  usuario: any;

  // Dados mockados – substitua pela resposta real da API
  tickets: Ticket[] = [
    { duracao: '30 Min', quantidade: 2 },
    { duracao: '1 Hora', quantidade: 6 },
    { duracao: '2 Horas', quantidade: 1 },
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    const token = localStorage.getItem('auth_token');

    this.http.get('http://localhost:4000/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.usuario = res.usuario;
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
        if (err.status === 401) this.logout();
      }
    });
  }

  usarTicket(ticket: Ticket) {
    if (ticket.quantidade <= 0) return;
    // Lógica de uso do ticket – integre com a API conforme necessário
    console.log('Usando ticket:', ticket.duracao);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('usuario_data');
    this.router.navigate(['/login']);
  }
}