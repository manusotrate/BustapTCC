import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

interface Ticket {
  id: number;
  minutos: number;
  valor: number;
  status: string;
}

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  standalone: false
})
export class TicketsComponent implements OnInit {

  ticketSelecionado: Ticket | null = null;
  tickets: Ticket[] = [];
  carregando: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private navCtrl: NavController,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.carregarTickets();
  }

  carregarTickets() {
    this.carregando = true;
    this.paymentService.getTickets().subscribe({
      next: (response) => {
        this.tickets = response.tickets;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tickets:', err);
        this.carregando = false;
      }
    });
  }

  confirmarUso(ticket: Ticket) {
    this.ticketSelecionado = ticket;
  }

  usarTicket() {
    if (!this.ticketSelecionado) return;
    const minutos = this.ticketSelecionado.minutos;
    this.ticketSelecionado = null;
    this.router.navigate(['/timer'], { queryParams: { minutos } });
  }

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