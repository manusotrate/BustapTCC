import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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

<<<<<<< HEAD
  private startY = 0;
  private currentY = 0;
  private isDragging = false;

  @ViewChild('menuContainer') menuContainer!: ElementRef;
=======
  // Cidades vindas de horarios.page
  cidadePartida: string = '';
  cidadeChegada: string = '';
  kmNecessario: number = 0;
>>>>>>> e34cf460bcad6877181a79e42c5bd61c83beb446

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

  // ── Gesto de arrastar para fechar ──
  onChevronTouchStart(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
    this.currentY = this.startY;
    this.isDragging = true;
  }

  onChevronTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    this.currentY = event.touches[0].clientY;
    const delta = this.currentY - this.startY;

    if (delta > 0) {
      const el = this.menuContainer.nativeElement;
      el.style.transition = 'none';
      el.style.transform = `translateY(${delta}px)`;
      // Vai ficando transparente conforme arrasta
      el.style.opacity = `${Math.max(0.4, 1 - delta / 400)}`;
    }
  }

  onChevronTouchEnd() {
    const delta = this.currentY - this.startY;
    const el = this.menuContainer.nativeElement;

    if (delta > 120) {
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      el.style.transform = 'translateY(100%)';
      el.style.opacity = '0';
      setTimeout(() => this.home(), 300);
    } else {
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    }

    this.isDragging = false;
  }
}