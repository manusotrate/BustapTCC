import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
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

  private startY = 0;
  private currentY = 0;
  private isDragging = false;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

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
    const km = this.ticketSelecionado.distancia_km;
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