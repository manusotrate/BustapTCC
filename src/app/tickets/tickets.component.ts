import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Ticket {
  minutos: number;
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

  // Dados mockados – substituir por chamada ao backend quando disponível
  tickets: Ticket[] = [
    { minutos: 30, quantidade: 2 },
    { minutos: 45, quantidade: 5 },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    const token = localStorage.getItem('token');

    this.http.get('http://localhost:4000/usuarios', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res: any) => {
        this.usuario = res.usuario;
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
      }
    });
  }

  usarTicket(ticket: Ticket) {
    this.router.navigate(['/timer'], {
      queryParams: { minutos: ticket.minutos }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  historico() {
    this.router.navigate(['/historico']);
  }

  home() {
    this.router.navigate(['/home']);
  }
  comprar() {
  this.router.navigate(['/comprar-tickets']);
}

  comprar() {
    this.router.navigate(['/comprar-tickets']);
  }
}
