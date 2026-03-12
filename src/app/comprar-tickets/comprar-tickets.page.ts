import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  tickets: Ticket[] = [
    { km: 10,  preco: 4.99,  precoFormatado: 'R$4,99'  },
    { km: 20,  preco: 8.99,  precoFormatado: 'R$8,99'  },
    { km: 30,  preco: 12.99, precoFormatado: 'R$12,99' },
    { km: 50,  preco: 19.99, precoFormatado: 'R$19,99' },
    { km: 75,  preco: 27.99, precoFormatado: 'R$27,99' },
    { km: 100, preco: 34.99, precoFormatado: 'R$34,99' },
    { km: 150, preco: 49.99, precoFormatado: 'R$49,99' },
    { km: 200, preco: 64.99, precoFormatado: 'R$64,99' },
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
      message: `Ticket de ${this.ticketSelecionado.km}km comprado com sucesso!`,
      duration: 2500,
      color: 'success',
      position: 'top'
    });
    await toast.present();

    this.ticketSelecionado = null;
  }
}