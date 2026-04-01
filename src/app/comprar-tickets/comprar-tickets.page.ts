import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';

interface Ticket {
  km: number;
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
    { km: 10,  preco: 5.99,  precoFormatado: 'R$5,99'  },
    { km: 20,  preco: 10.99, precoFormatado: 'R$10,99' },
    { km: 35,  preco: 17.99, precoFormatado: 'R$17,99' },
    { km: 50,  preco: 24.99, precoFormatado: 'R$24,99' },
    { km: 70,  preco: 33.99, precoFormatado: 'R$33,99' },
    { km: 90,  preco: 42.99, precoFormatado: 'R$42,99' },
    { km: 110, preco: 51.99, precoFormatado: 'R$51,99' },
    { km: 130, preco: 60.99, precoFormatado: 'R$60,99' },
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
    const { km, preco } = this.ticketSelecionado;

    // Passa km no lugar de minutos para o backend
    this.paymentService.comprarTicket(km, preco).subscribe({
      next: async (response) => {
        this.saldo = response.saldo;
        this.carregando = false;
        this.ticketSelecionado = null;

        const toast = await this.toastCtrl.create({
          message: `Ticket de ${km} km comprado com sucesso!`,
          duration: 2500,
          color: 'success',
          position: 'top'
        });
        await toast.present();

        // Navega de volta e força recarga da lista de tickets
        this.router.navigate(['/tickets'], { replaceUrl: true });
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