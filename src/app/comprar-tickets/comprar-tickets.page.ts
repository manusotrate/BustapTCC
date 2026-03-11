import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

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
    if (!this.ticketSelecionado) return;

    if (this.saldo < this.ticketSelecionado.preco) {
      this.ticketSelecionado = null;
      const toast = await this.toastCtrl.create({
        message: 'Saldo insuficiente.',
        duration: 2500,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    this.saldo -= this.ticketSelecionado.preco;

    const toast = await this.toastCtrl.create({
      message: `Ticket de ${this.ticketSelecionado.minutos} Min comprado com sucesso!`,
      duration: 2500,
      color: 'success',
      position: 'top'
    });
    await toast.present();

    this.ticketSelecionado = null;
  }
}