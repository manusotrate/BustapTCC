import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

interface Ticket {
  id: number;
  distancia_km: number;
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

  // Cidades vindas de horarios.page
  cidadePartida: string = '';
  cidadeChegada: string = '';
  kmNecessario: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navCtrl: NavController,
    private paymentService: PaymentService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Lê os queryParams vindos de horarios (se existirem)
    this.route.queryParams.subscribe(params => {
      if (params['partida']) this.cidadePartida = params['partida'];
      if (params['chegada']) this.cidadeChegada = params['chegada'];
      if (params['km'])      this.kmNecessario  = +params['km'];
    });

    this.carregarTickets();
  }

  ionViewWillEnter() {
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

    const ticket = this.ticketSelecionado;
    this.ticketSelecionado = null;

    // Chama o backend para marcar como usado e salvar no histórico
    this.paymentService.usarTicket(
      ticket.id,
      this.cidadePartida || 'Origem não informada',
      this.cidadeChegada || 'Destino não informado'
    ).subscribe({
      next: async () => {
        // Navega para trip passando km
        this.router.navigate(['/trip'], {
          queryParams: {
            km: ticket.distancia_km,
            partida: this.cidadePartida,
            chegada: this.cidadeChegada
          }
        });
      },
      error: async (err) => {
        const msg = err?.error?.erro || 'Erro ao usar ticket.';
        const toast = await this.toastCtrl.create({
          message: msg,
          duration: 2500,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    });
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