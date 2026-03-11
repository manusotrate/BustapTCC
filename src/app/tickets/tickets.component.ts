import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

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
  ticketSelecionado: Ticket | null = null;

  tickets: Ticket[] = [
    { minutos: 30, quantidade: 2 },
    { minutos: 45, quantidade: 5 },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    const token = this.authService.getToken();
    this.http.get('http://localhost:4000/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => { this.usuario = res.usuario; },
      error: (err) => { console.error('Erro ao carregar usuário:', err); }
    });
  }

  // Abre o modal de confirmação
  confirmarUso(ticket: Ticket) {
    this.ticketSelecionado = ticket;
  }

  // Confirma e navega para o timer
  usarTicket() {
    if (!this.ticketSelecionado) return;
    const ticket = this.ticketSelecionado;
    this.ticketSelecionado = null;
    this.router.navigate(['/timer'], {
      queryParams: { minutos: ticket.minutos }
    });
  }

  // Fecha o modal sem fazer nada
  cancelar() {
    this.ticketSelecionado = null;
  }

  logout() {
    this.authService.logout();
  }

  historico() {
    this.router.navigate(['/historico']);
  }

  home() {
    this.navCtrl.navigateBack('/home');
  }

  comprar() {
    this.router.navigate(['/comprar-tickets']);
  }
}