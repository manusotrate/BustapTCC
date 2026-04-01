import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

interface Ticket {
  id: number;
  minutos: number; // campo original do backend — mantemos compatibilidade
  km: number;      // campo novo (pode ser o mesmo campo renomeado no backend)
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

  // Chamado pelo Ionic toda vez que a página fica visível (inclusive ao voltar).
  // Isso garante que a lista atualiza automaticamente após uma compra.
  ionViewWillEnter() {
    this.carregarTickets();
  }

  carregarTickets() {
    this.carregando = true;
    this.paymentService.getTickets().subscribe({
      next: (response) => {
        // Suporte a backends que ainda usam "minutos" como campo:
        // se o ticket vier com "minutos", usamos esse valor como km
        // até que o backend seja atualizado para "km".
        this.tickets = response.tickets.map((t: any) => ({
          ...t,
          km: t.km ?? t.minutos // fallback para "minutos" se "km" não existir
        }));
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
    const km = this.ticketSelecionado.km;
    this.ticketSelecionado = null;
    this.router.navigate(['/trip'], { queryParams: { km } });
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