import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

interface Ticket {
  minutos: number;
  preco: number;
  precoFormatado: string;
}

@Component({
  selector: 'app-comprar-tickets',
  templateUrl: './comprar-tickets.page.html',
  styleUrls: ['./comprar-tickets.page.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class ComprarTicketsPage implements OnInit {

  saldo: number = 0;
  ticketSelecionado: Ticket | null = null;
  carregando: boolean = false;

  tickets: Ticket[] = [
    { minutos: 15,  preco: 8.99,  precoFormatado: 'R$8,99'  },
    { minutos: 30,  preco: 16.99, precoFormatado: 'R$16,99' },
    { minutos: 45,  preco: 24.99, precoFormatado: 'R$24,99' },
    { minutos: 60,  preco: 33.99, precoFormatado: 'R$33,99' },
    { minutos: 75,  preco: 41.99, precoFormatado: 'R$41,99' },
    { minutos: 90,  preco: 50.99, precoFormatado: 'R$50,99' },
    { minutos: 105, preco: 58.99, precoFormatado: 'R$58,99' },
    { minutos: 120, preco: 67.99, precoFormatado: 'R$67,99' },
  ];

  get saldoFormatado(): string {
    return `R$${this.saldo.toFixed(2).replace('.', ',')}`;
  }

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.carregarSaldo();
  }

  carregarSaldo() {
    this.paymentService.getSaldo().subscribe({
      next: (response) => {
        this.saldo = response.saldo;
      },
      error: (err) => {
        console.error('Erro ao carregar saldo:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }

  selecionarTicket(ticket: Ticket) {
    this.ticketSelecionado = ticket;
  }

  cancelar() {
    this.ticketSelecionado = null;
  }

  async confirmar() {
    if (!this.ticketSelecionado || this.carregando) return;

    this.carregando = true;
    const { minutos, preco } = this.ticketSelecionado;

    this.paymentService.comprarTicket(minutos, preco).subscribe({
      next: async (response) => {
        this.saldo = response.saldo;
        this.carregando = false;
        this.ticketSelecionado = null;

        const toast = await this.toastCtrl.create({
          message: `Ticket de ${minutos} Min comprado com sucesso!`,
          duration: 2500,
          color: 'success',
          position: 'top'
        });
        await toast.present();

        this.router.navigate(['/tickets']);
      },
      error: async (err) => {
        this.carregando = false;
        this.ticketSelecionado = null;
        const msg = err?.error?.erro || 'Erro ao comprar ticket.';
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
}